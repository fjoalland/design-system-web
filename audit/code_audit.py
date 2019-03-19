#
# AUTOMATIC CODE AUDIT
# 
# This script opens a list of JCMS plugins (projects) and generates an Excel workbook with all files

import svn.remote
import shutil
import glob
from os.path import getsize as get_size
import pathlib
from itertools import (takewhile,repeat)
import xml.etree.ElementTree as ET
import xlsxwriter
from xlsxwriter.worksheet import (cell_number_tuple, cell_string_tuple)

projects = [
    ('SEOPlugin', 'http://jade.cg44.fr/svn/institutionnel/plugins/SEOPlugin/trunk'),
    ('MarcheFaibleMontantPlugin', 'http://jade.cg44.fr/svn/institutionnel/plugins/MarcheFaibleMontantPlugin/trunk'),
    ('SuiviEngagementsPlugin','http://jade.cg44.fr/svn/institutionnel/plugins/SuiviEngagementsPlugin/trunk'),
    ('TimelinePlugin','http://jade.cg44.fr/svn/institutionnel/plugins/TimelinePlugin/trunk'),
    ('ToolsPlugin','http://jade.cg44.fr/svn/institutionnel/plugins/ToolsPlugin/trunk'),
    ('AgendaPlugin','http://jade.cg44.fr/svn/grandpatrimoine/plugins/AgendaPlugin/trunk'),
    ('CorporateIdentityPlugin','http://jade.cg44.fr/svn/institutionnel/plugins/CorporateIdentityPlugin/trunk'),
    ('EspaceEnseignantsPlugin','http://jade.cg44.fr/svn/grandpatrimoine/plugins/EspaceEnseignantsPlugin/trunk'),
    ('APIPlugin','http://jade.cg44.fr/svn/institutionnel/plugins/APIPlugin/trunk'),
    ('ArchivesPlugin','http://jade.cg44.fr/svn/archives/plugins/ArchivesPlugin/trunk'),
    ('BusinessRulesPlugin','http://jade.cg44.fr/svn/institutionnel/plugins/BusinessRulesPlugin/trunk'),
    ('EServicePlugin','http://jade.cg44.fr/svn/lila/plugins/EServicePlugin/trunk'),
    ('GrandPatrimoinePlugin','http://jade.cg44.fr/svn/grandpatrimoine/plugins/GrandPatrimoinePlugin/trunk'),
    ('BaladesnaturePlugin','http://jade.cg44.fr/svn/baladesnature/plugins/BaladesnaturePlugin/trunk'),
    ('InforoutesPlugin','http://jade.cg44.fr/svn/inforoutes/plugins/InforoutesPlugin/trunk'),
    ('LANumeriquePlugin','http://jade.cg44.fr/svn/lanumerique/plugins/LANumeriquePlugin/trunk'),
    ('ObservatoirePlugin','http://jade.cg44.fr/svn/observatoire/plugins/ObservatoirePlugin/trunk'),
    ('AdministrableTextePlugin','http://jade.cg44.fr/svn/assmat/plugins/AdministrableTextePlugin/trunk'),
    ('NewsletterPlugin','http://jade.cg44.fr/svn/inforoutes/plugins/NewsletterPlugin/trunk'),
]

def collect_data():
    shutil.rmtree('./data', ignore_errors=True)

    for name, url in projects:
        r = svn.remote.RemoteClient(url)
        r.export('./data/' + name)

def analyse_data(templates):
    audit = []
    for project, _ in projects:
        for filename in glob.iglob('data/%s/**/*' % project, recursive=True):
            path = pathlib.Path(filename)
            if path.is_file():
                f = filename.replace('\\', '/')
                audit.append({
                    'module' : project,
                    'path' : '/'.join(path.parts[2:-1]),
                    'file' : path.name,
                    'extension' : path.suffix.replace('.',''),
                    'size' : get_size(filename),
                    'lines' : count_lines(filename),
                    'template_usage' : templates[f]['usage'] if f in templates else '',
                    'template_label' : templates[f]['label'] if f in templates else '',
                    'template_type' : templates[f]['type'] if f in templates else '',
                })
    return audit

def xlsx_export(audit, filename):
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()
    for line_counter, line in enumerate(audit):
        for item_counter, item in enumerate(line.items()):
            if line_counter == 0:
                worksheet.write(0, item_counter, item[0])
            worksheet.write(line_counter+1, item_counter, item[1])

    for i in range(10):
        set_column_autowidth(worksheet, i)

    workbook.close()

def set_column_autowidth(worksheet, column):
    """
    Set the width automatically on a column in the `Worksheet`.
    !!! Make sure you run this function AFTER having all cells filled in
    the worksheet!
    """
    maxwidth = get_column_width(worksheet=worksheet, column=column)
    if maxwidth is None:
        return
    worksheet.set_column(first_col=column, last_col=column, width=maxwidth)

def get_column_width(worksheet, column: int):
    """Get the max column width in a `Worksheet` column."""
    strings = getattr(worksheet, '_ts_all_strings', None)
    if strings is None:
        strings = worksheet._ts_all_strings = sorted(
            worksheet.str_table.string_table,
            key=worksheet.str_table.string_table.__getitem__)
    lengths = set()
    for _, colums_dict in worksheet.table.items():  # type: int, dict
        data = colums_dict.get(column)
        if not data:
            continue
        if type(data) is cell_string_tuple:
            iter_length = len(strings[data.string])
            if not iter_length:
                continue
            lengths.add(iter_length)
            continue
        if type(data) is cell_number_tuple:
            iter_length = len(str(data.number))
            if not iter_length:
                continue
            lengths.add(iter_length)
    if not lengths:
        return None
    return max(lengths)

def analyse_plugin_xml():
    templates = {}
    for project, _ in projects:
        doc = ET.parse('data/%s/WEB-INF/plugins/%s/plugin.xml' % (project, project))
        for template_type in doc.findall('.//templates'):
            for template_elem in doc.findall('.//template'):
                template_path = "data/{}/plugins/{}/types/{}/{}".format(project, project, template_type.attrib["type"], template_elem.attrib["file"]),
                if template_path[0] in templates:
                    templates[template_path[0]] = {
                        'type' : templates[template_path[0]]['type'] + ', ' + template_type.attrib["type"],
                        'usage' : templates[template_path[0]]['usage'] + ', ' + template_elem.attrib["usage"],
                        'label' : templates[template_path[0]]['label'] + ', ' + template_elem.find('label').text
                    }
                else:
                    templates[template_path[0]] = {
                        'type' : template_type.attrib["type"],
                        'usage' : template_elem.attrib["usage"],
                        'label' : template_elem.find('label').text
                    }
    return templates

def count_lines(filename):
    f = open(filename, 'rb')
    bufgen = takewhile(lambda x: x, (f.raw.read(1024*1024) for _ in repeat(None)))
    return sum( buf.count(b'\n') for buf in bufgen )

if __name__ == "__main__":
    #collect_data()
    templates = analyse_plugin_xml()
    audit = analyse_data(templates)
    xlsx_export(audit, 'audit.xlsx')

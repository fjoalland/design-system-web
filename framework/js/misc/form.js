class MiscForm {
    static buildFormData(formData, data, parentKey) {
        if (
            data &&
            typeof data === 'object' &&
            !(data instanceof Date) &&
            !(data instanceof File)
        ) {
            Object.keys(data).forEach(key => {
                MiscForm.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
            });

            return;
        }

        const value = (data == null ? '' : data);
        formData.append(parentKey, value);
    }

    static jsonToFormData(data) {
        const formData = new FormData();
        MiscForm.buildFormData(formData, data);
        return formData;
    }
}

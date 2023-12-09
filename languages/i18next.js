import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ca from './ca.json';
import es from './es.json';

export const languageResources = {
    en: { translation: en },
    ca: { translation: ca },
    es: { translation: es },
};

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'ca',
    fallbackLng: 'ca',
    resources: languageResources,
});

export default i18next;

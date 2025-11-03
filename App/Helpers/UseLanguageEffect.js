import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const useLanguageEffect = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const getStoredLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem('language');
            if (storedLanguage) {
                i18n.changeLanguage(storedLanguage);
            }
        };
        getStoredLanguage();
    }, [i18n]);

    return null;
};

export default useLanguageEffect;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import dashboardEN from '../locales/en/dashboard.json';
import dashboardDE from '../locales/de/dashboard.json';
import dashboardPL from '../locales/pl/dashboard.json';
import navigationEN from '../locales/en/navigation.json';
import navigationDE from '../locales/de/navigation.json';
import navigationPL from '../locales/pl/navigation.json';
import createNewPlanEN from '../locales/en/createNewPlan.json';
import createNewPlanDE from '../locales/de/createNewPlan.json';
import createNewPlanPL from '../locales/pl/createNewPlan.json';
import trainingPlanEN from '../locales/en/trainingPlan.json';
import trainingPlanDE from '../locales/de/trainingPlan.json';
import trainingPlanPL from '../locales/pl/trainingPlan.json';
import trainingPlanWeekEN from '../locales/en/trainingPlanWeek.json';
import trainingPlanWeekDE from '../locales/de/trainingPlanWeek.json';
import trainingPlanWeekPL from '../locales/pl/trainingPlanWeek.json';
import dayDetailsEN from '../locales/en/dayDetails.json';
import dayDetailsDE from '../locales/de/dayDetails.json';
import dayDetailsPL from '../locales/pl/dayDetails.json';
import requestsEN from '../locales/en/requests.json';
import requestsDE from '../locales/de/requests.json';
import requestsPL from '../locales/pl/requests.json';
import trainingPlansEN from '../locales/en/trainingPlans.json';
import trainingPlansDE from '../locales/de/trainingPlans.json';
import trainingPlansPL from '../locales/pl/trainingPlans.json';
import weekTableEN from '../locales/en/weekTable.json';
import weekTableDE from '../locales/de/weekTable.json';
import weekTablePL from '../locales/pl/weekTable.json';
import planDetailsEN from '../locales/en/planDetails.json';
import planDetailsDE from '../locales/en/planDetails.json';
import planDetailsPL from '../locales/pl/planDetails.json';
import startTrainingEN from '../locales/en/startTraining.json';
import startTrainingDE from '../locales/de/startTraining.json';
import startTrainingPL from '../locales/pl/startTraining.json';
import trainingSessionEN from '../locales/en/trainingSession.json';
import trainingSessionDE from '../locales/de/trainingSession.json';
import trainingSessionPL from '../locales/pl/trainingSession.json';
import myProfileTrainerEN from '../locales/en/my-profileTrainer.json';
import myProfileTrainerDE from '../locales/de/my-profileTrainer.json';
import myProfileTrainerPL from '../locales/pl/my-profileTrainer.json';
import exerciseAtlasEN from '../locales/en/exerciseAtlas.json';
import exerciseAtlasDE from '../locales/de/exerciseAtlas.json';
import exerciseAtlasPL from '../locales/pl/exerciseAtlas.json';
import chatEN from '../locales/en/chat.json';
import chatDE from '../locales/de/chat.json';
import chatPL from '../locales/pl/chat.json';
import trainerListEN from '../locales/en/trainerList.json';
import trainerListDE from '../locales/de/trainerList.json';
import trainerListPL from '../locales/pl/trainerList.json';
import myProfileUserEN from '../locales/en/my-profileUser.json';
import myProfileUserDE from '../locales/de/my-profileUser.json';
import myProfileUserPL from '../locales/pl/my-profileUser.json';
import offerEN from '../locales/en/offer.json';
import offerDE from '../locales/de/offer.json';
import offerPL from '../locales/pl/offer.json';
import workoutPlansEN from '../locales/en/workoutPlans.json';
import workoutPlansDE from '../locales/de/workoutPlans.json';
import workoutPlansPL from '../locales/pl/workoutPlans.json';
import workoutIdEN from '../locales/en/workoutId.json';
import workoutIdDE from '../locales/de/workoutId.json';
import workoutIdPL from '../locales/pl/workoutId.json';
import statisticEN from '../locales/en/statistic.json';
import statisticDE from '../locales/de/statistic.json';
import statisticPL from '../locales/pl/statistic.json';
import aiTrainingPlanEN from '../locales/en/aiTrainingPlan.json';
import aiTrainingPlanDE from '../locales/de/aiTrainingPlan.json';
import aiTrainingPlanPL from '../locales/pl/aiTrainingPlan.json';
import loginEN from '../locales/en/login.json';
import loginDE from '../locales/de/login.json';
import loginPL from '../locales/pl/login.json';
import registerEN from '../locales/en/register.json';
import registerDE from '../locales/de/register.json';
import registerPL from '../locales/pl/register.json';
import completeProfileEN from '../locales/en/complete-profile.json';
import completeProfileDE from '../locales/de/complete-profile.json';
import completeProfilePL from '../locales/pl/complete-profile.json';
import deleteAccountEN from '../locales/en/deleteAccount.json';
import deleteAccountDE from '../locales/de/deleteAccount.json';
import deleteAccountPL from '../locales/pl/deleteAccount.json';
import storeEN from '../locales/en/store.json';
import storeDE from '../locales/de/store.json';
import storePL from '../locales/pl/store.json';
import dataManageEN from '../locales/en/dataManage.json';
import dataManageDE from '../locales/de/dataManage.json';
import dataManagePL from '../locales/pl/dataManage.json';

const resources = {
    en: {
        dashboard: dashboardEN,
        navigation: navigationEN,
        createNewPlan: createNewPlanEN,
        trainingPlan: trainingPlanEN,
        trainingPlanWeek: trainingPlanWeekEN,
        dayDetails: dayDetailsEN,
        requests: requestsEN,
        trainingPlans: trainingPlansEN,
        weekTable: weekTableEN,
        planDetails: planDetailsEN,
        startTraining: startTrainingEN,
        trainingSession: trainingSessionEN,
        myProfileTrainer: myProfileTrainerEN,
        exerciseAtlas: exerciseAtlasEN,
        chat: chatEN,
        trainerList: trainerListEN,
        myProfileUser: myProfileUserEN,
        offer: offerEN,
        workoutPlans: workoutPlansEN,
        workoutId: workoutIdEN,
        statistic: statisticEN,
        aiTrainingPlan: aiTrainingPlanEN,
        login: loginEN,
        register: registerEN,
        completeProfile: completeProfileEN,
        deleteAccount: deleteAccountEN,
        store: storeEN,
        dataManage: dataManageEN,
    },
    de: {
        dashboard: dashboardDE,
        navigation: navigationDE,
        createNewPlan: createNewPlanDE,
        trainingPlan: trainingPlanDE,
        trainingPlanWeek: trainingPlanWeekDE,
        dayDetails: dayDetailsDE,
        requests: requestsDE,
        trainingPlans: trainingPlansDE,
        weekTable: weekTableDE,
        planDetails: planDetailsDE,
        startTraining: startTrainingDE,
        trainingSession: trainingSessionDE,
        myProfileTrainer: myProfileTrainerDE,
        exerciseAtlas: exerciseAtlasDE,
        chat: chatDE,
        trainerList: trainerListDE,
        myProfileUser: myProfileUserDE,
        offer: offerDE,
        workoutPlans: workoutPlansDE,
        workoutId: workoutIdDE,
        statistic: statisticDE,
        aiTrainingPlan: aiTrainingPlanDE,
        login: loginDE,
        register: registerDE,
        completeProfile: completeProfileDE,
        deleteAccount: deleteAccountDE,
        store: storeDE,
        dataManage: dataManageDE,
    },
    pl: {
        dashboard: dashboardPL,
        navigation: navigationPL,
        createNewPlan: createNewPlanPL,
        trainingPlan: trainingPlanPL,
        trainingPlanWeek: trainingPlanWeekPL,
        dayDetails: dayDetailsPL,
        requests: requestsPL,
        trainingPlans: trainingPlansPL,
        weekTable: weekTablePL,
        planDetails: planDetailsPL,
        startTraining: startTrainingPL,
        trainingSession: trainingSessionPL,
        myProfileTrainer: myProfileTrainerPL,
        exerciseAtlas: exerciseAtlasPL,
        chat: chatPL,
        trainerList: trainerListPL,
        myProfileUser: myProfileUserPL,
        offer: offerPL,
        workoutPlans: workoutPlansPL,
        workoutId: workoutIdPL,
        statistic: statisticPL,
        aiTrainingPlan: aiTrainingPlanPL,
        login: loginPL,
        register: registerPL,
        completeProfile: completeProfilePL,
        deleteAccount: deleteAccountPL,
        store: storePL,
        dataManage: dataManagePL,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,

        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie'],
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
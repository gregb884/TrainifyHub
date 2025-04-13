/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: "https://trainifyhub.com",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: [
        "/dashboard",
        "/aiTrainingPlan",
        "/aiTrainingPlan/newAiPlan",
        "/createNewPlan",
        "/exerciseAtlas",
        "/my-profileTrainer",
        "/my-profileUser",
        "/offer",
        "/offer/workoutPlans",
        "/requests",
        "/startTraining",
        "/statistic",
        "/trainerList",
        "/trainingPlans",
        "/trainingPlansOld",
        "/trainingSession"
    ],
};

module.exports = sitemapConfig;
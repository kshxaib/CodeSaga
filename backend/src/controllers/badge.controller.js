import { BADGE_CRITERIA } from "../constants/badges.js";
import { db } from "../libs/db.js";

const checkAndAwardBadges = async (userId, context={}) => {
    try {
        const userStats = await db.user.findUnique({
            where: {id: userId},
            include: {
                submissions: {
                    where: {status: "ACCEPTED"},
                    orderBy: {createdAt: "desc"}
                },
                problemSolved: true
            }
        })

        //checking all badges criteria
        const badgesToAward = [];

        // Quick Thinker Badge
        if(context.solveTime && context.solveTime <= BADGE_CRITERIA.QUICK_THINKER.maxTime){
           
        }
    } catch (error) {
        
    }
}


async function awardBadge(userId, badgeName) {
    const badge = await db.badge.findFirst({
        where: {name: badgeName}
    })

    if(!badge) return

    const user = await db.user.findUnique({
        where: {id: userId}
    })

    if(!user) return

    const userBadges = JSON.parse(user.badges || "[]")

    if(!userBadges.some(b => b.id === badge.id)){
        userBadges.push({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            description: badge.description,
            earnedAt: new Date().toISOString()
        })

        await db.user.update({
            where: {id: userId},
            data: {
                badges: JSON.stringify(userBadges)
            }
        })

        return badge
    }
}

export { awardBadge , checkAndAwardBadges}
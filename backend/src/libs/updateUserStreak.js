import {db} from "./db.js"

export const updateUserStreak = async (userId) => {
    try {
        const user = await db.user.findUnique({
            where: {id: userId}
        })
        const today = new Date()
        const lastSolved = user.lastSolvedDate 
        console.log(`lastsolved: ${lastSolved}, today's date: ${today}`)

        // Check if today is the same day as lastSolved
        const shouldReset = lastSolved && 
            !isSameDay(today, lastSolved) && 
            !isConsecutiveDay(today, lastSolved);

        //update
        const newStreak = shouldReset ? 1 : user.currentStreak + 1;

        await db.user.update({
            where: {id: userId},
            data: {
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, user.longestStreak),
                lastSolvedDate: today
            }
        })
    } catch (error) {
        console.log("Error while updating user's streak", error)
    }
}


const isSameDay = (date1, date2) => {
    return  date1.toDateString() === date2.toDateString();
}

const isConsecutiveDay = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24
    return Math.abs(date1 - date2) <= oneDay
} 
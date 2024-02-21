module.exports = function calculateScore(questionsUsed) {
    let score = 1100
    const deduction = questionsUsed*50
    return (score - deduction)
}
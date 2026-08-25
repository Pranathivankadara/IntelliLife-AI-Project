// =========================================
// INTELLILIFE AI - AI CONTROLLER
// =========================================

const { processAIMessage } = require("../services/aiService");

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a message."
            });
        }

        // Get logged-in user's ID from JWT middleware
        const userId = req.user.id;

        // Send message to AI service
        const result = await processAIMessage(
            message,
            userId
        );

        return res.status(200).json({
            success: true,
            intent: result.intent,
            reply: result.reply
        });

    } catch (error) {
        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong with the AI Assistant."
        });
    }
};

module.exports = {
    chatWithAI
};
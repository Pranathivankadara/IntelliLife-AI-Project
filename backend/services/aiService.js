// =========================================
// INTELLILIFE AI - AI SERVICE
// Local NLP Assistant
// =========================================

const Task = require("../models/Task");

// =========================================
// MAIN AI PROCESSOR
// =========================================

const processAIMessage = async (message, userId) => {
    try {
        if (!message || !message.trim()) {
            return {
                intent: "GENERAL",
                reply: "Please tell me what you want me to do."
            };
        }

        const originalText = message.trim();
        const text = originalText.toLowerCase().trim();

        // =========================================
        // GREETING
        // =========================================

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text === "hii" ||
            text === "hlo"
        ) {
            return {
                intent: "GENERAL",
                reply: "Hello! 👋 How can I help you?"
            };
        }

        // =========================================
        // COMPLETE + SHOW PENDING
        // =========================================

        if (
            isCompleteCommand(text) &&
            (
                text.includes("pending") ||
                text.includes("remaining") ||
                text.includes("left") ||
                text.includes("chupinchu") ||
                text.includes("show")
            )
        ) {
            const taskText = extractCompleteTask(originalText);

            const completeReply = await completeTask(
                taskText,
                userId
            );

            const pendingReply = await getPendingTasks(
                userId
            );

            return {
                intent: "MULTI_ACTION",
                reply: `${completeReply}\n\n${pendingReply}`
            };
        }

        // =========================================
        // DELETE + SHOW
        // =========================================

        if (
            (
                text.startsWith("delete ") ||
                text.startsWith("remove ")
            ) &&
            (
                text.includes("show") ||
                text.includes("pending")
            )
        ) {
            const taskText = originalText
                .replace(/^delete\s+/i, "")
                .replace(/^remove\s+/i, "")
                .split(/\s+and\s+/i)[0]
                .trim();

            const deleteReply = await deleteTask(
                taskText,
                userId
            );

            const pendingReply = await getPendingTasks(
                userId
            );

            return {
                intent: "MULTI_ACTION",
                reply: `${deleteReply}\n\n${pendingReply}`
            };
        }

        // =========================================
        // COMPLETE TASK
        // =========================================

        if (isCompleteCommand(text)) {
            const taskText = extractCompleteTask(
                originalText
            );

            return {
                intent: "COMPLETE_TASK",
                reply: await completeTask(
                    taskText,
                    userId
                )
            };
        }

        // =========================================
        // DELETE TASK
        // =========================================

        if (
            text.startsWith("delete ") ||
            text.startsWith("remove ")
        ) {
            const taskText = originalText
                .replace(/^delete\s+/i, "")
                .replace(/^remove\s+/i, "")
                .trim();

            return {
                intent: "DELETE_TASK",
                reply: await deleteTask(
                    taskText,
                    userId
                )
            };
        }

        // =========================================
        // SHOW COMPLETED TASKS
        // =========================================

        if (
            text.includes("completed tasks") ||
            text.includes("completed task") ||
            text.includes("finished tasks") ||
            text.includes("finished task") ||
            text.includes("complete chesina tasks") ||
            text.includes("complete chesina task")
        ) {
            return {
                intent: "SHOW_COMPLETED_TASKS",
                reply: await getCompletedTasks(userId)
            };
        }

        // =========================================
        // SHOW PENDING TASKS
        // =========================================

        if (
            text.includes("pending tasks") ||
            text.includes("pending task") ||
            text === "pending" ||
            text.includes("show tasks") ||
            text.includes("show my tasks") ||
            text.includes("remaining tasks") ||
            text.includes("what's left") ||
            text.includes("whats left") ||
            text.includes("chupinchu")
        ) {
            return {
                intent: "SHOW_TASKS",
                reply: await getPendingTasks(userId)
            };
        }

        // =========================================
        // TASK PROGRESS
        // =========================================

        if (
            text.includes("progress") ||
            text.includes("task count") ||
            text.includes("how many tasks") ||
            text.includes("na progress")
        ) {
            return {
                intent: "TASK_PROGRESS",
                reply: await getProgress(userId)
            };
        }

        // =========================================
        // STUDY COMMAND
        // =========================================

        if (isStudyCommand(text)) {

            const subjects = extractStudySubjects(
                originalText
            );

            if (subjects.length === 0) {
                return {
                    intent: "GENERAL",
                    reply: "Which subject do you want to study?"
                };
            }

            const replies = [];

            for (const subject of subjects) {

                const taskText = `study ${subject}`;

                const result = await addTask(
                    taskText,
                    userId
                );

                replies.push(result);
            }

            return {
                intent:
                    replies.length > 1
                        ? "MULTI_ACTION"
                        : "ADD_TASK",

                reply: replies.join("\n")
            };
        }

        // =========================================
        // ADD TASK
        // =========================================

        if (
            text.startsWith("add ") ||
            text.startsWith("create ") ||
            text.startsWith("create task ")
        ) {

            let taskText = originalText
                .replace(/^create task\s+/i, "")
                .replace(/^create\s+/i, "")
                .replace(/^add\s+/i, "")
                .trim();

            if (!taskText) {
                return {
                    intent: "ADD_TASK",
                    reply: "What task should I add?"
                };
            }

            return {
                intent: "ADD_TASK",
                reply: await addTask(
                    taskText,
                    userId
                )
            };
        }

        // =========================================
        // TELUGU / TELUGU-ENGLISH TASK
        // Example:
        // Naku Java mariyu DBMS chadavali
        // =========================================

        if (
            text.includes("naku") &&
            (
                text.includes("chadavali") ||
                text.includes("cheyali")
            )
        ) {

            const subjects = extractStudySubjects(
                originalText
            );

            if (subjects.length > 0) {

                const replies = [];

                for (const subject of subjects) {

                    const taskText =
                        `study ${subject}`;

                    const result =
                        await addTask(
                            taskText,
                            userId
                        );

                    replies.push(result);
                }

                return {
                    intent:
                        replies.length > 1
                            ? "MULTI_ACTION"
                            : "ADD_TASK",

                    reply: replies.join("\n")
                };
            }
        }

        // =========================================
        // GENERAL
        // =========================================

        return {
            intent: "GENERAL",
            reply:
                "I understood your message, but I'm still learning how to help with that. 🤖"
        };

    } catch (error) {

        console.error("=================================");
        console.error("AI SERVICE ERROR");
        console.error(error);
        console.error("=================================");

        return {
            intent: "GENERAL",
            reply:
                "Sorry, I couldn't process your request. 🤖"
        };
    }
};


// =========================================
// ADD TASK
// =========================================

async function addTask(taskText, userId) {

    const cleanText =
        cleanTaskText(taskText);

    if (!cleanText) {
        return "Please tell me what task you want to add.";
    }

    // =========================================
    // CHECK DUPLICATE
    // =========================================

    const duplicate =
        await findDuplicateTask(
            cleanText,
            userId
        );

    if (duplicate) {
        return `"${duplicate.text}" is already in your task list.`;
    }

    // =========================================
    // IMPORTANT
    // =========================================
    // AI-created tasks are stored using
    // YOUR EXISTING TASK MODEL.
    //
    // This keeps them connected to the
    // existing Task Manager.
    // =========================================

    const newTask =
        await Task.create({
            user: userId,
            text: cleanText,
            done: false
        });

    return `"${newTask.text}" added to your tasks. ✅`;
}


// =========================================
// COMPLETE TASK
// =========================================

async function completeTask(
    taskText,
    userId
) {

    if (!taskText) {
        return "Which task should I complete?";
    }

    const task =
        await findTask(
            taskText,
            userId
        );

    if (!task) {
        return `I couldn't find a task matching "${taskText}".`;
    }

    if (task.done) {
        return `"${task.text}" is already completed. ✅`;
    }

    task.done = true;

    await task.save();

    return `"${task.text}" marked as completed. ✅`;
}


// =========================================
// DELETE TASK
// =========================================

async function deleteTask(
    taskText,
    userId
) {

    if (!taskText) {
        return "Which task should I delete?";
    }

    const task =
        await findTask(
            taskText,
            userId
        );

    if (!task) {
        return `I couldn't find a task matching "${taskText}".`;
    }

    await Task.deleteOne({
        _id: task._id,
        user: userId
    });

    return `"${task.text}" deleted successfully. 🗑️`;
}


// =========================================
// GET PENDING TASKS
// =========================================

async function getPendingTasks(userId) {

    const tasks =
        await Task.find({
            user: userId,
            done: false
        }).sort({
            _id: -1
        });

    if (tasks.length === 0) {
        return "You don't have any pending tasks. 🎉";
    }

    const list =
        tasks
            .map(
                (task, index) =>
                    `${index + 1}. ${task.text}`
            )
            .join("\n");

    return `Here are your pending tasks:\n${list}`;
}


// =========================================
// GET COMPLETED TASKS
// =========================================

async function getCompletedTasks(userId) {

    const tasks =
        await Task.find({
            user: userId,
            done: true
        }).sort({
            _id: -1
        });

    if (tasks.length === 0) {
        return "You haven't completed any tasks yet.";
    }

    const list =
        tasks
            .map(
                (task, index) =>
                    `${index + 1}. ${task.text}`
            )
            .join("\n");

    return `Here are your completed tasks:\n${list}`;
}


// =========================================
// TASK PROGRESS
// =========================================

async function getProgress(userId) {

    const tasks =
        await Task.find({
            user: userId
        });

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.done
        ).length;

    const pending =
        total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    return (
        `You have ${total} tasks.\n` +
        `Completed: ${completed} ✅\n` +
        `Pending: ${pending} ⏳\n` +
        `Progress: ${percentage}%`
    );
}


// =========================================
// FIND TASK
// =========================================

async function findTask(
    taskText,
    userId
) {

    if (!taskText) {
        return null;
    }

    const tasks =
        await Task.find({
            user: userId
        }).sort({
            _id: -1
        });

    const search =
        normalizeForMatching(
            taskText
        );

    // =========================================
    // EXACT MATCH
    // =========================================

    let task =
        tasks.find(
            task =>
                normalizeForMatching(
                    task.text
                ) === search
        );

    if (task) {
        return task;
    }

    // =========================================
    // SUBJECT MATCH
    // Example:
    // Python
    // matches:
    // study Python
    // =========================================

    task =
        tasks.find(task => {

            const taskNormalized =
                normalizeForMatching(
                    task.text
                );

            return (
                taskNormalized === search ||
                taskNormalized.endsWith(
                    ` ${search}`
                ) ||
                search.endsWith(
                    ` ${taskNormalized}`
                )
            );
        });

    if (task) {
        return task;
    }

    // =========================================
    // WORD MATCH
    // =========================================

    const searchWords =
        search
            .split(/\s+/)
            .filter(Boolean);

    task =
        tasks.find(task => {

            const taskWords =
                normalizeForMatching(
                    task.text
                )
                    .split(/\s+/)
                    .filter(Boolean);

            return searchWords.every(
                word =>
                    taskWords.includes(word)
            );
        });

    return task || null;
}


// =========================================
// FIND DUPLICATE TASK
// =========================================

async function findDuplicateTask(
    taskText,
    userId
) {

    if (!taskText) {
        return null;
    }

    const tasks =
        await Task.find({
            user: userId
        });

    const search =
        normalizeForMatching(
            taskText
        );

    const duplicate =
        tasks.find(task => {

            const existing =
                normalizeForMatching(
                    task.text
                );

            return existing === search;
        });

    return duplicate || null;
}


// =========================================
// NORMALIZE TEXT
// =========================================

function normalizeForMatching(text) {

    return String(text)
        .toLowerCase()
        .replace(/[.,!?]/g, " ")
        .replace(
            /\b(to|my|the|a|an|please)\b/g,
            " "
        )
        .replace(/\s+/g, " ")
        .trim();
}


// =========================================
// CLEAN TASK TEXT
// =========================================

function cleanTaskText(text) {

    return String(text)
        .replace(/\s+/g, " ")
        .trim();
}


// =========================================
// CHECK STUDY COMMAND
// =========================================

function isStudyCommand(text) {

    return (
        text.includes("chadavali") ||
        text.includes("nerchukovali") ||
        text.includes("study cheyali") ||
        text.startsWith("study ") ||
        text.startsWith("learn ")
    );
}


// =========================================
// EXTRACT STUDY SUBJECTS
// =========================================

function extractStudySubjects(
    originalText
) {

    let text =
        originalText.trim();

    // =========================================
    // REMOVE "Naku"
    // =========================================

    text =
        text.replace(
            /^naku\s+/i,
            ""
        );

    // =========================================
    // REMOVE STUDY / LEARN
    // =========================================

    text =
        text.replace(
            /^study\s+/i,
            ""
        );

    text =
        text.replace(
            /^learn\s+/i,
            ""
        );

    // =========================================
    // REMOVE ENDING
    // =========================================

    text =
        text.replace(
            /\s+(chadavali|nerchukovali|study cheyali|cheyali)\s*$/i,
            ""
        );

    text =
        text.trim();

    if (!text) {
        return [];
    }

    // =========================================
    // SPLIT MULTIPLE SUBJECTS
    // =========================================

    const subjects =
        text
            .split(
                /\s+(?:mariyu|mari|and|&|also)\s+/i
            )
            .map(
                subject =>
                    subject.trim()
            )
            .filter(Boolean);

    return subjects;
}


// =========================================
// CHECK COMPLETE COMMAND
// =========================================

function isCompleteCommand(text) {

    return (
        text.startsWith("complete ") ||
        text.startsWith("finish ") ||
        text.startsWith("finished ") ||
        text.includes(" complete cheyyi") ||
        text.includes(" complete chey") ||
        text.includes(" finish cheyyi") ||
        text.includes(" finish chey")
    );
}


// =========================================
// EXTRACT COMPLETE TASK
// =========================================

function extractCompleteTask(
    originalText
) {

    let text =
        originalText.trim();

    // =========================================
    // ENGLISH
    // =========================================

    text =
        text.replace(
            /^complete\s+/i,
            ""
        );

    text =
        text.replace(
            /^finish\s+/i,
            ""
        );

    text =
        text.replace(
            /^finished\s+/i,
            ""
        );

    // =========================================
    // TELUGU-ENGLISH
    // =========================================

    text =
        text.replace(
            /\s+complete\s+(cheyyi|chey|chesa|chesanu)?/i,
            ""
        );

    text =
        text.replace(
            /\s+finish\s+(cheyyi|chey|chesa|chesanu)?/i,
            ""
        );

    // =========================================
    // MULTI COMMAND
    // =========================================

    text =
        text.split(
            /\s+and\s+/i
        )[0];

    text =
        text.trim();

    return text;
}


// =========================================
// EXPORT
// =========================================

module.exports = {
    processAIMessage
};
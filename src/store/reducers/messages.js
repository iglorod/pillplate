import * as actionTypes from '../actions/actionTypes';

const initialState = {
    savingMessages: false,
    recivingMessage: false,
    topics: {},
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_MESSAGES_SAVING: {
            return {
                ...state,
                savingMessages: true,
            }
        }

        case actionTypes.FINISH_MESSAGES_SAVING: {
            return {
                ...state,
                savingMessages: false,
            }
        }

        case actionTypes.START_MESSAGES_RECIVE: {
            return {
                ...state,
                recivingMessage: true,
            }
        }

        case actionTypes.FINISH_MESSAGES_RECIVE: {
            return {
                ...state,
                recivingMessage: false,
            }
        }

        case actionTypes.MESSAGE_SAVE: {
            let topicMessages = [
                { ...action.message }
            ]

            if (state.topics[action.message.topicId] && state.topics[action.message.topicId].messages)
                topicMessages = [
                    ...state.topics[action.message.topicId].messages,
                    {
                        ...action.message
                    }
                ]

            return {
                ...state,
                topics: {
                    ...state.topics,
                    [action.message.topicId]: {
                        ...state.topics[action.message.topicId],
                        messages: [
                            ...topicMessages,
                        ]
                    }
                }
            }
        }

        case actionTypes.FETCH_MESSAGES: {
            if (action.messages.length === 0) {
                return state;
            }

            let topicMessages = [
                ...action.messages
            ]

            if (state.topics[action.topicId] && state.topics[action.topicId].messages) {
                topicMessages = [
                    ...action.messages,
                    ...state.topics[action.topicId].messages,
                ]
            }

            return {
                ...state,
                topics: {
                    ...state.topics,
                    [action.topicId]: {
                        ...state.topics[action.topicId],
                        messages: [
                            ...topicMessages,
                        ],
                    }
                }
            }
        }

        case actionTypes.EDIT_MESSAGE: {
            const topicId = action.message.topicId;

            const topicMessages = state.topics[topicId].messages.map(message => {
                if (message._id === action.message._id) {
                    message.wasReadedBy = [...action.message.wasReadedBy];
                    message.text = action.message.text;
                }

                return message;
            })

            return {
                ...state,
                topics: {
                    ...state.topics,
                    [topicId]: {
                        ...state.topics[topicId],
                        messages: [
                            ...topicMessages,
                        ],
                    }
                }
            }
        }

        case actionTypes.REMOVE_MESSAGE: {
            const topicId = action.message.topicId;

            return {
                ...state,
                topics: {
                    ...state.topics,
                    [topicId]: {
                        ...state.topics[topicId],
                        messages: state.topics[topicId].messages.filter(message => message._id !== action.message._id),
                    }
                }
            }
        }

        case actionTypes.LOGOUT_MESSAGES: {
            return { ...initialState }
        }

        default: return state;
    }
}

export default reducer;

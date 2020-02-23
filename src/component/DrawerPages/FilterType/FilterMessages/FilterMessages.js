import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';

import useStyles from '../styles';
import MessageItems from './MessageItems/MessageItems';
import EmptyMessage from './EmptyMessage/EmptyMessage';
import LoadMessages from './LoadMessages/LoadMessages';

const scrollToTopPosition = (topPosition, parent, delay) => {
    $(parent).animate({ scrollTop: topPosition }, delay);
}

const getTopPostion = (el) => {
    return $(el).offset().top
}

const FilterMessages = (props) => {
    const classes = useStyles();

    const [filterMessages, setFilterMessages] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [, setAllowToFetch] = useState(false);
    const [, setSkip] = useState(0);
    const [firstFetching, setFirstFetching] = useState(true);

    useEffect(() => {
        fetchFilterMessages(15).then(() => {
            firstFetchingScroll();
        });
    }, [])

    const getSkip = () => {
        let skip = null;
        setSkip(prevState => {
            skip = prevState;
            return prevState;
        });
        return skip;
    }

    const getLastMessages = () => {
        let messages = [];
        setFilterMessages(prevState => {
            messages = prevState;
            return prevState;
        });
        return messages;
    }

    const getLastAllowToFetch = () => {
        let allow = null;
        setAllowToFetch(prevState => {
            allow = prevState;
            return prevState;
        });
        return allow;
    }

    const getLastFetching = () => {
        let fetching = null;
        setFetching(prevState => {
            fetching = prevState;
            return prevState;
        });
        return fetching;
    }

    const firstFetchingScroll = () => {
        setFirstFetching(false);

        let messages = document.querySelector(".type-messages")
        let lastMessage = document.querySelector(".type-messages .message:last-of-type");

        if (lastMessage) {
            scrollToTopPosition(getTopPostion(lastMessage), messages, 500)
        }

        setAllowToFetch(true);
    }

    const prevFetchingScroll = (firstMessage) => {
        const messages = document.querySelector(".type-messages");
        let newFirstMessageTopPosition = getTopPostion(firstMessage);

        if (firstMessage) {
            scrollToTopPosition(newFirstMessageTopPosition, messages, 0);
        }
    }

    const fetchPreviousMessages = () => {
        if (!getLastAllowToFetch() || getLastFetching()) return;
        const firstMessage = document.querySelectorAll(".type-messages .message")[1];

        setFetching(true);
        fetchFilterMessages(15).then(() => {
            prevFetchingScroll(firstMessage);
            setFetching(false);
        });
    }

    const fetchFilterMessages = (limit) => {
        return new Promise((resolve, reject) => {
            const queryChunks =
                '?type=' + props.fetchType
                + '&skip=' + getSkip()
                + '&limit=' + limit;

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + props.token;
            axios.get('http://localhost:4000/topic/messages/filter/' + props.idUser + queryChunks)
                .then(messages => {
                    updateFilterMessages(messages.data.reverse(), resolve);
                })
                .catch(err => {
                    setFetching(false);
                    console.log(err);
                    reject(err);
                })
        })
    }

    const updateFilterMessages = (newMessages, resolve) => {
        if (newMessages.length < 15) setAllowToFetch(false);

        let currentMessages = [...getLastMessages()];
        setFilterMessages([
            ...newMessages,
            ...currentMessages,
        ]);

        setSkip(prevSkip => prevSkip + 15);
        resolve();
    }

    let messages = <EmptyMessage />
    if (filterMessages.length > 0) {
        messages = <MessageItems
            filterMessages={filterMessages}
            fetchPreviousMessages={fetchPreviousMessages}
            fetching={fetching} />
    }
    if (firstFetching) messages = <LoadMessages />

    return (
        <div className={classes.messagesBlock}>
            {messages}
        </div>
    )
}

export default FilterMessages;

import React from 'react';
import { IconButton, Typography, Link } from '@material-ui/core';

import useStyles from '../../styles';
import { ReactLink } from '../../../UI/Link/Link';

const AppBarLink = (props) => {
    const classes = useStyles();

    return (
        <IconButton
            edge="start"
            onClick={props.logout}
            className={classes.appBarButton}
        >
            <Link
                component={ReactLink}
                to={props.link}
                color="inherit"
                underline="none"
                className={classes.appBarLink}
            >
                {props.icon}
                <Typography variant="body1" noWrap>{props.text}</Typography>
            </Link>
        </IconButton>
    )
}

export default AppBarLink;
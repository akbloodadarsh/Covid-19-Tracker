import React from 'react'
import { Avatar } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import './Table.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }),
);

function Table({countries}) {
    const classes = useStyles();
    return (
        <div className="table">
            {
                countries.map(({country,cases,countryInfo}) =>(
                    <tr className={classes.root}>
                        <td><Avatar alt="country flag" src={countryInfo.flag} className={classes.small} /> <h3>{country}</h3></td>
                        <td><h3>{cases}</h3></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
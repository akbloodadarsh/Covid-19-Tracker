import React from 'react'
import { Avatar } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import './Table.css'
import numeral from 'numeral'

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
        <div className="table card_box">
            {
                countries.map(({country,cases,countryInfo}) =>(
                    <tr key={country} className={classes.root}>
                        <td><Avatar key={country} alt="country flag" src={countryInfo.flag} className={classes.small} /> <h3>{country}</h3></td>
                        <td><h3>{numeral(cases).format("0,0")}</h3></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
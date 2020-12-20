import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css'

function InfoBox({title,cases , total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox && ${title==='Recovered' ? 'infoBox__recovered' : title==='Deaths' ? 'infoBox__deaths' : ''}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h1 className="infoBox__cases">
                     {cases}
                </h1>
                <Typography className="infoBox__total" color="textSecondary">
                    Total : {total}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox

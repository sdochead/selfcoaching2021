import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
//        maxWidth: 400,
    },
  media: {
        height: 0,
        paddingTop: '100%', // 16:9,
      
    },
});



export default function Health() {

    const classes = useStyles();

    return(

        <Card className={classes.roots}>
            <CardActionArea>
                <CardMedia className={classes.media} image="/health.jpg" title="health avatar" align="center"/>
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="h2">
                    Health Dream
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Body: 3 goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Mind: 3 goals
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>

        )
}
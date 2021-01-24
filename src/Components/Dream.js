import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
//        maxWidth: 400,
    },
  media: {
        height: 0,
        paddingTop: '100%', // 16:9,
      
    },
});

export default function Dream() {

    const classes = useStyles();

    return (

        <div>
            
            <Card className={classes.root}>
                <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image="/wheel.png"
                    title="Wheel"
                />
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="h2">
                    Wheel of Life
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    <Link to={'health'}>Health</Link>: 7/10, 3 Goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    <Link to={'money'}>Money</Link>: 6/10, 2 Goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    <Link to={'career'}>Career</Link>: 6/10, 2 Goals                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Leisure: 2 goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Environment: 2 goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Friends: 1 goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Family: 2 goals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                    Growth: 2 goals
                    </Typography>                        

                </CardContent>
                </CardActionArea>
                <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Learn More
                </Button>
                </CardActions>
            </Card>
        </div>

    );   

}
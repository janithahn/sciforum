import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Button, Grid, Hidden, Tooltip, IconButton, Popper, Grow, Paper, ClickAwayListener, MenuItem, MenuList } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import InfiniteScroll from 'react-infinite-scroller';
import HomeLoader from './skeletons/homeSkels';
import News from '../news/news';

export default function RenderPosts({ fetchPostInfinite, hasMoreItems, PostsList }) {

    const history = useHistory();
    
    //filter list
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const filterByDate = (event) => {
        history.push('/home/filter/latest');
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const filterByMostVoted = (event) => {
        history.push('/home/filter/by_vote');
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const filterByDefault = (event) => {
        history.push('/questions');
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    //end filter list

    return(
        <React.Fragment>
            <Grid container direction="row" spacing={3} justify="space-between" alignItems="flex-start">
                <Grid item lg={8} sm xs={12}>
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                        <Grid item>
                            <Tooltip title="Filter Questions By">
                                <IconButton size="small"
                                    ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                >
                                    <FilterList/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <RouterLink to="/ask" style={{textDecoration: 'none'}}>
                                <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                            </RouterLink>
                        </Grid>
                    </Grid>
                    {<InfiniteScroll
                        pageStart={0}
                        loadMore={fetchPostInfinite}
                        hasMore={hasMoreItems}
                        loader={<HomeLoader/>}
                        threshold={900}
                    >
                        {PostsList}
                    </InfiniteScroll>}
                </Grid>
                <Grid item lg={4}>
                    <Hidden smDown>
                        <News/>
                    </Hidden>
                </Grid>
            </Grid>
            <FilterMenu 
                open={open} 
                setOpen={setOpen} 
                anchorRef={anchorRef}
                filterByDate={filterByDate}
                filterByMostVoted={filterByMostVoted}
                filterByDefault={filterByDefault}
            />
        </React.Fragment>
    );
}

const FilterMenu = ({ open, setOpen, anchorRef, filterByDate, filterByMostVoted, filterByDefault }) => {

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return(
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={(event) => filterByDate(event)}>Latest</MenuItem>
                    <MenuItem onClick={(event) => filterByMostVoted(event)}>Most Voted</MenuItem>
                    <MenuItem onClick={(event) => filterByDefault(event)}>Default</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    );
}
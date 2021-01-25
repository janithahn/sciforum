import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import Link from '@material-ui/core/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useStyles, useToolbarStyles } from './styles/notificationsStyles';
import TimeAgo from 'react-timeago';
import AlertSnackbar from '../alert/snackbar';
import { useDispatch } from 'react-redux';
import { patchNotifications, deleteNotifications } from '../../redux/ActionCreators';
//import { Link } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getItemIndexById(items, id) {
    const index = items.findIndex(x => x.id === id);
    return index;
}

function getMessageKeyword(notificationsCount) {
    if(notificationsCount === 1) return 'notification';
    return 'notifications';
}

const headCells = [
  { id: 'notification', numeric: false, disablePadding: true, label: 'Notification' },
  { id: 'question', numeric: true, disablePadding: false, label: '' },
  { id: 'date', numeric: true, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all notifications' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
          >
            <Box fontWeight="fontWeightBold">
                {headCell.label}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const DropDown = ({anchorEl, handleClick, open, handleClose, id, handleMarkAllAsRead, handleDeleteAllRowsData}) => {
    return(
        <div>
            <IconButton
                aria-label="more"
                aria-describedby={id}
                onClick={handleClick}
            > 
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleMarkAllAsRead}>Mark all as read</MenuItem>
                <MenuItem onClick={handleDeleteAllRowsData}>Delete All</MenuItem>
            </Menu>
      </div>
    );
}

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, handleReadState, unreadState, handleMarkAllAsRead, handleClick, handleClose, open, id, anchorEl, handleDeleteRowsData, handleDeleteAllRowsData } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Recent Notifications
        </Typography>
      )}

      {numSelected > 0 ? (
        <Grid container direction="row" justify="flex-end">
            {unreadState ? <Tooltip title="Mark as read">
                <IconButton aria-label="mark-as-read" onClick={() => handleReadState()}>
                    <CheckIcon/>
                </IconButton>
            </Tooltip>: undefined}
            <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={() => handleDeleteRowsData()}>
                <DeleteIcon />
            </IconButton>
            </Tooltip>
        </Grid>
      ) : (
        <Tooltip title="More">
            <DropDown 
                anchorEl={anchorEl} 
                handleClick={handleClick} 
                open={open} 
                handleClose={handleClose}
                id={id}
                handleMarkAllAsRead={handleMarkAllAsRead}
                handleDeleteAllRowsData={handleDeleteAllRowsData}
            />
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows, currentUser }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowsData, setRowsData] = React.useState(rows);
  const [unreadState, setUnreadState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  let notificationsCount = 0;

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'more-popover' : undefined;

  // handle unread state for marking them as read
  const handleUnreadState = React.useCallback(() => {
    const checkArr = [];

    for(let item of rowsData) {
        for(let s of selected) {
            if(item.id === s) {
                checkArr.push(item.state);
            }
        }
    }

    if(checkArr.includes(true)) setUnreadState(true);
    else setUnreadState(false);
  }, [rowsData, selected]);

  React.useEffect(() => {
    handleUnreadState();
  }, [selected, rowsData, handleUnreadState]);

  //console.log(unreadState);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    console.log(event.target.value);
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // changing the read state of rowsData
  const handleReadState = () => {
    selected.map(id => {
        let items = rowsData;
        const index = getItemIndexById(items, id);
        if(items[index].state) {
            notificationsCount += 1;
            dispatch(patchNotifications(id, false));
        }
        let item = {
            ...items[index],
            state: false,
        }
        items[index] = item;
        setRowsData(items);
        return id;
    });
    setSelected([]);
    setSnackMessage(notificationsCount + ' ' + getMessageKeyword(notificationsCount) + ' marked as read');
    setSnackOpen(true);
  };

  const handleOnClickMarkAsRead = (id) => {
    let items = rowsData;
    const index = getItemIndexById(items, id);
    if(items[index].state) {
        dispatch(patchNotifications(id, false));
    }
    let item = {
        ...items[index],
        state: false,
    }
    items[index] = item;
    setRowsData(items);
  };

  const handleMarkAllAsRead = () => {
    let newRowsData = [];
    rowsData.map(item => {
        if(item.state) {
            notificationsCount += 1;
            dispatch(patchNotifications(item.id, false));
        }
        let newItem = {
            ...item,
            state: false,
        }
        newRowsData.push(newItem);
        return item;
    });
    setRowsData(newRowsData);
    handleClose();
    setSnackMessage(notificationsCount + ' ' + getMessageKeyword(notificationsCount) + ' marked as read');
    setSnackOpen(true);
  };

  const handleDeleteRowsData = () => {
    selected.map(id => {
        let items = rowsData;
        const index = getItemIndexById(items, id);
        if(index > -1) {
            items.splice(index, 1);
        }
        dispatch(deleteNotifications(id));
        setRowsData(items);
        return id;
    });
    notificationsCount = selected.length;
    setSelected([]);
    setSnackMessage(notificationsCount + ' ' + getMessageKeyword(notificationsCount) + ' deleted');
    setSnackOpen(true);
  };

  const handleDeleteAllRowsData = () => {
    rowsData.map(item => {
        notificationsCount += 1;
        dispatch(deleteNotifications(item.id));
        return item;
    });
    setRowsData([]);
    setSelected([]);
    setSnackMessage(notificationsCount + ' ' + getMessageKeyword(notificationsCount) + ' deleted');
    setSnackOpen(true);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  //console.log(rows);

  const pickLink = (row) => {
    if(row.action_object){
      if(row.action_object.notification_type === "comment | answer comment") return(
        <Link color="inherit" underline="none" href={`/questions/${row.action_object.post}/#ac${row.action_object.id}`}>
          {row.notification}
        </Link>
      );

      if(row.action_object.notification_type === "comment | post comment") return(
        <Link onClick={() => handleOnClickMarkAsRead(row.id)} color="inherit" underline="none" href={`/questions/${row.action_object.post}/#pc${row.action_object.id}`}>
          {row.notification}
        </Link>
      )

      if(row.action_object.notification_type === "answer | answer") return(
        <Link color="inherit" underline="none" href={`/questions/${row.action_object.postBelong}/#${row.action_object.id}`}>
          {row.notification}
        </Link>
      )

      if(row.action_object.notification_type === "post | post") return(
        <Link color="inherit" underline="none" href={`/questions/${row.action_object.id}/`}>
          {row.notification}
        </Link>
      )
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
            numSelected={selected.length} 
            handleReadState={handleReadState} 
            handleMarkAllAsRead={handleMarkAllAsRead} 
            unreadState={unreadState}
            handleClick={handleMoreClick}
            handleClose={handleClose}
            open={open}
            id={id}
            anchorEl={anchorEl}
            handleDeleteRowsData={handleDeleteRowsData}
            handleDeleteAllRowsData={handleDeleteAllRowsData}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rowsData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  if(row.actor.username === currentUser) {
                    return <div key={row.id}></div>
                  }else {
                    return (
                        <TableRow
                            key={row.id}
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                <Box fontWeight={row.state ? "fontWeightBold": ""} fontSize={14}>
                                  {row.action_object ? 
                                    pickLink(row): row.notification
                                  }
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                {row.action_object && row.action_object.title ? row.action_object.title: ''}
                            </TableCell>
                            <TableCell align="right">
                                <TimeAgo live={false} date={row.date}/>
                            </TableCell>
                        </TableRow>
                    );
                  }
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <AlertSnackbar open={snackOpen} setOpen={setSnackOpen} message={snackMessage}/>
    </div>
  );
}

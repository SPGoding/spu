import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircleProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import MenuIcon from "mdi-material-ui/Menu";
import InfoIcon from "mdi-material-ui/InformationOutline";
import TransferIcon from "mdi-material-ui/TransferRight";
import MoreIcon from "mdi-material-ui/ChevronDown";

import { transformCommand } from "../../js/index";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    marginLeft: drawerWidth
  },
  menuButton: {
    marginRight: 20
  },
  button: {
    margin: 4
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  paper: {
    padding: 4,
    margin: 4
  },
  textField: {},
  progress: {
    margin: 24
  }
});

const versions = {
  14: "1.14(快照)",
  13: "1.13",
  12: "1.12",
  11: "1.11",
  9: "1.9",
  8: "1.8"
};

class ResponsiveDrawer extends React.Component {
  state = {
    open: false,
    aboutDialogOpen: false,
    resultDialogOpen: false,
    fromMenuOpen: false,
    toMenuOpen: false,
    anchorEl: null,

    fromVersion: 13,
    toVersion: 14,
    resultObject: {
      state: "loading",
      commands: [],
      log: []
    }
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleAboutDialogToggle = () => {
    this.setState(state => ({
      open: false,
      aboutDialogOpen: !state.aboutDialogOpen
    }));
  };

  handleResultDialogToggle = () => {
    this.setState(state => ({
      open: false,
      resultDialogOpen: !state.resultDialogOpen
    }));
  };

  handleBeginTransform = () => {
    this.setState(state => ({
      open: false,

      resultObject: {
        state: "loading",
        commands: [],
        log: []
      }
    }));
    this.setState(state => ({
      resultDialogOpen: true
    }));
    //transformCommand(this.refs.input)

    console.log(this.refs["input"].labelNode.innerText);
  };

  handleFromMenuToggle = function(version) {
    return () => {
      this.setState(state => ({
        fromMenuOpen: !state.fromMenuOpen,
        fromVersion: version !== undefined ? version : state.fromVersion,
        toVersion: 14
      }));
    };
  };

  handleToMenuToggle = function(version) {
    return () => {
      this.setState(state => ({
        toMenuOpen: !state.toMenuOpen,
        toVersion: version !== undefined ? version : state.toVersion
      }));
    };
  };

  handleFromMenuOpen = event =>
    this.setState({
      anchorEl: event.currentTarget,
      fromMenuOpen: true
    });

  handleToMenuOpen = event =>
    this.setState({
      anchorEl: event.currentTarget,
      toMenuOpen: true
    });

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="打开侧边栏"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              SPU
            </Typography>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            open={this.state.open}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <List>
              <ListItem button onClick={this.handleAboutDialogToggle}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="关于" />
              </ListItem>
            </List>
            <Divider />
          </Drawer>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Grid container spacing={24}>
            <Grid item xs />
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={24}>
                  <Grid item xs />
                  <Grid item xs>
                    <Button
                      className={classes.button}
                      onClick={this.handleFromMenuOpen}
                    >
                      {versions[this.state.fromVersion]}
                    </Button>
                    <Menu
                      open={this.state.fromMenuOpen}
                      onClose={this.handleFromMenuToggle()}
                      anchorEl={this.state.anchorEl}
                    >
                      <MenuItem onClick={this.handleFromMenuToggle(13)}>
                        {versions[13]}
                      </MenuItem>
                      <MenuItem onClick={this.handleFromMenuToggle(12)}>
                        {versions[12]}
                      </MenuItem>
                      <MenuItem onClick={this.handleFromMenuToggle(11)}>
                        {versions[11]}
                      </MenuItem>
                      <MenuItem onClick={this.handleFromMenuToggle(9)}>
                        {versions[9]}
                      </MenuItem>
                      <MenuItem onClick={this.handleFromMenuToggle(8)}>
                        {versions[8]}
                      </MenuItem>
                    </Menu>
                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                      onClick={this.handleBeginTransform}
                    >
                      <TransferIcon />
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={this.handleToMenuOpen}
                    >
                      {versions[this.state.toVersion]}
                    </Button>
                    <Menu
                      open={this.state.toMenuOpen}
                      onClose={this.handleToMenuToggle()}
                      anchorEl={this.state.anchorEl}
                    >
                      {this.state.fromVersion < 14 && (
                        <MenuItem onClick={this.handleToMenuToggle(14)}>
                          {versions[14]}
                        </MenuItem>
                      )}
                      {this.state.fromVersion < 13 && (
                        <MenuItem onClick={this.handleToMenuToggle(13)}>
                          {versions[13]}
                        </MenuItem>
                      )}
                      {this.state.fromVersion < 12 && (
                        <MenuItem onClick={this.handleToMenuToggle(12)}>
                          {versions[12]}
                        </MenuItem>
                      )}
                      {this.state.fromVersion < 11 && (
                        <MenuItem onClick={this.handleToMenuToggle(11)}>
                          {versions[11]}
                        </MenuItem>
                      )}
                      {this.state.fromVersion < 9 && (
                        <MenuItem onClick={this.handleToMenuToggle(9)}>
                          {versions[9]}
                        </MenuItem>
                      )}
                    </Menu>
                  </Grid>
                  <Grid item xs />
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs />
          </Grid>
          <TextField
            id="before"
            multiline
            label="待转换的指令"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            fullWidth
            ref="input"
          />
          <Dialog
            open={this.state.resultDialogOpen}
            onClose={this.handleResultDialogToggle}
            scroll="paper"
            fullWidth={this.state.resultObject.state !== "loading"}
          >
            {this.state.resultObject.state === "loading" && (
              <DialogContent>
                <CircleProgress size={70} className={classes.progress} />
              </DialogContent>
            )}
            {this.state.resultObject.state === "success" && (
              <div>
                <DialogTitle>转换结果</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    defaultValue={this.state.resultObject.commands.reduce(
                      (ans, now) => {
                        return ans + now + "\n";
                      },
                      ""
                    )}
                  />
                </DialogContent>
              </div>
            )}
            {this.state.resultObject.state === "warning" && (
              <div>
                <DialogTitle>转换结果</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    defaultValue={this.state.resultObject.commands.reduce(
                      (ans, now) => {
                        return ans + now + "\n";
                      },
                      ""
                    )}
                  />
                  <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<MoreIcon />}>
                      <Typography variant="body1">警告信息</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        defaultValue={this.state.resultObject.log.reduce(
                          (ans, now) => {
                            return ans + now + "\n";
                          },
                          ""
                        )}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </DialogContent>
              </div>
            )}
            {this.state.resultObject.state === "danger" && (
              <div>
                <DialogTitle>发生错误</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    defaultValue={this.state.resultObject.log.reduce(
                      (ans, now) => {
                        return ans + now + "\n";
                      },
                      ""
                    )}
                  />
                </DialogContent>
              </div>
            )}
          </Dialog>
          <Dialog
            open={this.state.aboutDialogOpen}
            onClose={this.handleAboutDialogToggle}
            scroll="paper"
          >
            <DialogTitle>关于</DialogTitle>
            <DialogContent>
              <Typography paragraph variant="p">
                {"贡献者列表："}
              </Typography>
              <Typography paragraph variant="body1">
                {"@SPGoding"}
                <Button href="http://www.mcbbs.net/?2444378">MCBBS</Button>{" "}
                <Button href="https://github.com/SPGoding">Github</Button>{" "}
                <Button href="https://afdian.net/@SPGoding">爱发电</Button>
              </Typography>
              <Typography paragraph variant="body1">
                {"@langyo"}
                <Button href="http://www.mcbbs.net/?1287472">MCBBS</Button>{" "}
                <Button href="https://github.com/langyo">Github</Button>{" "}
                <Button href="https://afdian.net/@langyo">爱发电</Button>
              </Typography>
              <Typography paragraph variant="body1">
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  href="https://github.com/SPGoding/spu"
                >
                  {"该项目在 Github 的开源仓库地址"}
                </Button>
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  href="http://www.mcbbs.net/thread-786687-1-1.html"
                >
                  {"该项目在 MCBBS 的宣传贴"}
                </Button>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleAboutDialogToggle} color="primary">
                {"好哒"}
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);

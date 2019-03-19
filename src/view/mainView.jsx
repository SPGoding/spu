import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SnackBar from "@material-ui/core/SnackBar";
import SnackBarContent from "@material-ui/core/SnackbarContent";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import MenuIcon from "mdi-material-ui/Menu";
import InfoIcon from "mdi-material-ui/InformationOutline";
import DeleteIcon from "mdi-material-ui/DeleteOutline";
import TransferIcon from "mdi-material-ui/TransferRight";
import CloseIcon from "mdi-material-ui/Close";
import ColorIcon from "mdi-material-ui/BorderColor";

import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import { transformCommand } from "../../js/index";

const drawerWidth = 240;

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: blue,
        error: red
    },
    typography: {
        useNextVariants: true,
    }
});

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
    center: {
        width: 240,
        marginLeft: "auto",
        marginRight: "auto"
    },
    progress: {
        margin: 24
    }
});

const latestFromVersion = 13
const latestToVersion = 14
const versions = {
    14: "1.14(快照)",
    13: "1.13",
    12: "1.12",
    11: "1.11",
    9: "1.9",
    8: "1.8"
};

class MainView extends React.Component {
    state = {
        open: false,
        snack: false,
        aboutDialogOpen: false,
        fromMenuOpen: false,
        toMenuOpen: false,
        anchorEl: null,

        fromVersion: (() => {
            try {
                const from = Number(localStorage.getItem('from'))
                if (versions.hasOwnProperty(from)) {
                    return from
                } else {
                    throw `Unknown 'from' version in localStorage: '${from}'.`
                }
            } catch (_) {
                // Ignore it.
                return latestFromVersion
            }
        })(),
        toVersion: (() => {
            try {
                const to = Number(localStorage.getItem('to'))
                if (versions.hasOwnProperty(to)) {
                    return to
                } else {
                    throw `Unknown 'to' version in localStorage: '${to}'.`
                }
            } catch (_) {
                // Ignore it.
                return latestToVersion
            }
        })(),
        inputCommands: (() => {
            try {
                const input = localStorage.getItem('input')
                if (typeof input === 'string') {
                    return input
                } else {
                    throw `No 'input' detected in localStorage.`
                }
            } catch (_) {
                // Ignore it.
                return ''
            }
        })(),
        resultObject: {
            state: "waiting",
            commands: [],
            log: []
        },
        warningInfoStack: []
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

    handleClearCache = () => {
        this.setState(state => ({
            open: false
        }));
        localStorage.clear()
    };

    handleBeginTransform = () => {
        this.setState(() => ({
            open: false,

            resultObject: {
                state: "loading",
                commands: [],
                logs: []
            }
        }));

        const ret = transformCommand(this.state.inputCommands, this.state.fromVersion, this.state.toVersion);

        if (ret.state === 'warning' || ret.state === 'error') {
            this.setState(state => ({
                snack: true,
                warningInfoStack: (() => {
                    const list = state.warningInfoStack;
                    for (const n of ret.logs) {
                        list.push(n);
                    }
                    return list;
                })()
            }));
        }

        this.setState(() => ({
            resultObject: {
                state: ret.state,
                commands: ret.commands,
                logs: ret.logs
            }
        }));
    };

    handleCloseSnackBar = () => {
        this.setState(() => ({
            snack: false
        }));
        if (this.state.warningInfoStack.length > 0) this.setState(() => ({
            snack: true
        }));
    }

    handleFromMenuToggle = function (version) {
        return () => {
            localStorage.setItem('from', version)
            this.setState(state => ({
                fromMenuOpen: !state.fromMenuOpen,
                fromVersion: version !== undefined ? version : state.fromVersion,
                // TODO: We can change the 'to' version to a better version. (@SPGoding)
                toVersion: latestToVersion
            }));
        };
    };

    handleToMenuToggle = function (version) {
        return () => {
            localStorage.setItem('to', version)
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

    handleChangeInputCommand = event => {
        localStorage.setItem('input', event.target.value)
        this.setState({
            inputCommands: event.target.value
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <MuiThemeProvider theme={theme}>
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
                                <ListItem button disabled>
                                    <ListItemIcon>
                                        <ColorIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="更换主题" />
                                </ListItem>
                                <ListItem button onClick={this.handleClearCache}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="清除缓存" />
                                </ListItem>
                            </List>
                            <Divider />
                        </Drawer>
                    </nav>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Grid container spacing={8}>
                            <Grid item lg md />
                            <Grid item lg={4} md={8} xs={12}>
                                <Paper className={classes.paper}>
                                    <div className={classes.center}>
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
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item lg md />
                        </Grid>
                        <Grid container spacing={8}>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    id="before"
                                    multiline
                                    label="欲转换的命令/函数"
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    onChange={this.handleChangeInputCommand}
                                    value={this.state.inputCommands}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    id="before"
                                    multiline
                                    label="转换后的命令"
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    value={this.state.resultObject.commands.join('\n')}
                                    readOnly
                                    ref="output"
                                />
                            </Grid>
                        </Grid>
                        {/* 消息条，出现日志信息 */}
                        <SnackBar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            open={this.state.snack === true}
                            autoHideDuration={5000}
                        >
                            <SnackBarContent
                                message={this.state.warningInfoStack.shift()}
                                action={[
                                    <IconButton
                                        aria-label="Close"
                                        key={233}
                                        color="inherit"
                                        onClick={this.handleCloseSnackBar}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                ]}
                            />
                        </SnackBar>

                        {/* 关于窗口 */}
                        <Dialog
                            open={this.state.aboutDialogOpen}
                            onClose={this.handleAboutDialogToggle}
                            scroll="paper"
                        >
                            <DialogTitle>关于</DialogTitle>
                            <DialogContent>
                                <Typography paragraph variant="p">
                                    {"贡献者"}
                                </Typography>
                                <Typography paragraph variant="body1">
                                    {"@SPGoding ("}
                                    <Button href="http://www.mcbbs.net/?2444378">MCBBS</Button>{" "}
                                    <Button href="https://github.com/SPGoding">GitHub</Button>{" "}
                                    <Button href="https://afdian.net/@SPGoding">爱发电</Button>{")"}
                                </Typography>
                                <Typography paragraph variant="body1">
                                    {"@langyo ("}
                                    <Button href="http://www.mcbbs.net/?1287472">MCBBS</Button>{" "}
                                    <Button href="https://github.com/langyo">GitHub</Button>{" "}
                                    <Button href="https://afdian.net/@langyo">爱发电</Button>{")"}
                                </Typography>
                                <Typography paragraph variant="body1">
                                    {"@pca006132 ("}
                                    <Button href="http://www.mcbbs.net/?193048">MCBBS</Button>{" "}
                                    <Button href="https://github.com/pca006132">GitHub</Button>{")"}
                                </Typography>
                                <Typography paragraph variant="body1">
                                    <Button
                                        className={classes.button}
                                        variant="outlined"
                                        color="primary"
                                        href="https://github.com/SPGoding/spu"
                                    >
                                        {"该项目在 GitHub 的开源仓库地址"}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="outlined"
                                        color="primary"
                                        href="http://www.mcbbs.net/thread-786687-1-1.html"
                                    >
                                        {"该项目在 MCBBS 的发布贴"}
                                    </Button>
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleAboutDialogToggle} color="primary">
                                    {"确定"}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </main>
                </MuiThemeProvider>
            </div>
        );
    }
}

MainView.propTypes = {
    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MainView);

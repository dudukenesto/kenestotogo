import React from "react";
import TabView from "../components/TabView";
import Drawer from "react-native-drawer";
import Main from '../components/Main';



class App extends React.Component {
    render(){
       // const children = this.props.navigationState.children;
        return (
            <Drawer
                ref="navigation"
                type="overlay"
                open= {false}
                content={<TabView loggedUser = {this.props.loggedUser}/>}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
                })}>
                   <Main />
            </Drawer>
        );
    }
}

export default App
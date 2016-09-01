import React from "react";
import TabView from "../components/TabView";
import Drawer from "react-native-drawer";
import Main from '../components/Main';



class App extends React.Component {

isDrawerOpen()
{

 return this._drawer._open;
}
closeDrawer(){
    this._drawer.close()
  };

    render(){
       // const children = this.props.navigationState.children;
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                open= {false}
                content={<TabView loggedUser = {this.props.loggedUser} closeDrawer={this.closeDrawer.bind(this)} />}
                tapToClose={true}
                openDrawerOffset={0.15}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
                })}>
                   <Main closeDrawer={this.closeDrawer.bind(this)} isDrawerOpen={this.isDrawerOpen.bind(this)} />
            </Drawer>
        );
    }
}

export default App
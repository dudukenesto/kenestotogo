import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons'
import * as navActions from '../actions/navActions'
import { scanRoute } from '../constants/routes'
import { getDocumentsContext, getSelectedDocument } from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
    },
    actionButtonIcon: {
        fontSize: 45,
    },
    actionHolder: {
        width: 90,
        height: 90,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    actionName: {
        textAlign: "center",
        fontSize: 14,
        color: "#000",
    },


})

class UpdateVersions extends React.Component {
    constructor(props) {
        super(props);
    }

    scan(isCameraScan: boolean) {
        this.props.closeModal();
        const documentsContext = getDocumentsContext(this.props.navReducer);
        var document = getSelectedDocument(this.props.documentlists, this.props.navReducer);
        var data = {
            key: "scan",
            catId: documentsContext.catId,
            baseFileId:document.Id,
            fId: documentsContext.fId,
            sortDirection: documentsContext.sortDirection,
            sortBy: documentsContext.sortBy,
            isCameraScan: isCameraScan,
            name: 'Image to upload'
        }
        this.props.dispatch(navActions.push(scanRoute(data).route));
    }

    render() {



        return (
            <View style={styles.container}>
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} onPress={() => { this.scan.bind(this)(false) } } />
                    <Text style={styles.actionName}>Upload File</Text>
                </View>

                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} onPress={() => { this.scan.bind(this)(true) } } />
                    <Text style={styles.actionName}>Scan</Text>
                </View>
            </View>
        )
    }

}

UpdateVersions.contextTypes = {
    plusMenuContext: React.PropTypes.object
}

function mapStateToProps(state) {
    const { navReducer, documentlists } = state

    return {
        navReducer: navReducer,
        documentlists:documentlists
    }
}


export default connect(mapStateToProps)(UpdateVersions)
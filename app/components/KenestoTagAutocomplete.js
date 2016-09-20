'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ListView,
  TouchableHighlight,
} from 'react-native';

import Tag from './Tag';

export default class KenestoTagAutocomplete extends Component {

  // static propTypes = {
  //   initialTags: React.PropTypes.arrayOf(React.PropTypes.string),
  //   suggestions: React.PropTypes.arrayOf(React.PropTypes.string),
  //   placeholder: React.PropTypes.string,
  //   footerText: React.PropTypes.string,
  //   height: React.PropTypes.number,
  //   fontSize: React.PropTypes.number,
  //   containerStyle: View.propTypes.style,
  //   inputContainerStyle: View.propTypes.style,
  //   textInputStyle: TextInput.propTypes.style,
  //   listStyle: ListView.propTypes.style,
  //   onUpdateTags: React.PropTypes.func,
  //   onUpdateLayout: React.PropTypes.func,
  // }

  static defaultProps = {
    initialTags: [],
    suggestions: [],
    placeholder: 'Select tag or enter tag name...',
    addNewTagTitle: 'Add a new tag',
    onUpdateTags: () => {},
    onUpdateLayout: () => {},
    containerStyle: null,
    inputContainerStyle: null,
    textInputStyle: null,
    listStyle: null,
    minCharsToStartAutocomplete: 0
  }

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this._filterList(props.initialTags)),
      showlist: false,
      tags: props.initialTags,
      userInput: '',
      listPosition: {
        top: 100,
        left: 0,
        right: 0,
      }
    }
  }

  getTags() {
    return this.state.tags;
  }

  blur() {
    this.refs.textInput.blur();
  }

  focus() {
    this.refs.textInput.focus();
  }

  clearText() {
    this.setState({userInput: ''});
    this.refs.textInput.setNativeProps({text: ''});
  }

  _filterList(newTags) {
    var filteredList = this.props.suggestions.filter((listElement) => {
      if(this.props.autocompleteField){
        return listElement[this.props.autocompleteField] !== newTags.find((t) => (t === listElement[this.props.autocompleteField]))
      }
      else {
        return listElement !== newTags.find((t) => (t === listElement))
      }
      
    });
    return filteredList;
  }

  _addTag(text) {
    var newTags = this.state.tags.concat([text]);
    var filteredList = this._filterList(newTags);
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList)
    });

    this.clearText();

    this.props.onChange(newTags);
  }
  
  _addNewTag(text){
    var tag = text;
      if (this.props.formatNewTag) {
        tag = this.props.formatNewTag(tag)
      }
      
      if(tag === false){
        // this.clearText();
        if(this.props.onErrorAddNewTag){
          this.props.onErrorAddNewTag(text);
        }
      }
      else {
        this._addTag(tag);
      }      
    }

  _renderRow(rowData, sectionID, rowID) {
    const {rowContainerStyle, autocompleteTextStyle} = this.props;
    var autocompleteString = rowData[this.props.autocompleteField] || rowData;
    var searchedTextLength = this.state.userInput.length;
    var searchedIndex = autocompleteString.indexOf(this.state.userInput);
    var textBefore = autocompleteString.substr(0, searchedIndex);
    var textAfter = autocompleteString.substr(searchedIndex+searchedTextLength);
    var autocompleteFormattedString = (<View style={{flexDirection: "row"}}><Text style={styles.text}>{textBefore}</Text>
      <Text style={[styles.searchedText, autocompleteTextStyle]}>{this.state.userInput}</Text>
      <Text style={styles.text}>{textAfter}</Text></View>)
    return (
      <TouchableHighlight onPress={this._addTag.bind(this, autocompleteString)}>
        <View style={[styles.rowContainer, rowContainerStyle]}>
          {this.props.autocompleteRowTemplate ?
            this.props.autocompleteRowTemplate(autocompleteFormattedString, rowData)
            :
            autocompleteFormattedString
          }
          
        </View>
      </TouchableHighlight>
    )
  }

  _renderFooter() {
    const { userInput, tags } = this.state;
    const shouldRender = ( userInput && !tags.includes(userInput) && this.props.allowAddingNewTags ) ? true : false;
    const { addNewTagTitle, newTagStyle, newTagContainerStyle } = this.props
    if (shouldRender) {
      return (
        <TouchableHighlight onPress={this._addNewTag.bind(this, userInput)} underlayColor={"#efefef"}>
          <View style={[styles.newTagContainer, newTagContainerStyle]}>
            <Text style={[styles.newTagText, newTagStyle]}>{addNewTagTitle + ' \"' + userInput + '\"'}</Text>
          </View>
        </TouchableHighlight>
      )
    }

    return null;
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={rowID} style={styles.separator}/>
    )
  }

  _onBlur() {
    this.blur();
    this.setState({showList: false});
    this.props.onHideTagsList();
  }

  _onFocus() {
    this.setState({showList: true});
    this.props.onShowTagsList();
  }

  _onChangeText(text) {
    
    var filteredList = this.props.suggestions.filter((listElement) => {
      // return !this.state.tags.find(t => (t === tag)) && tag.includes(text);
      if(this.props.autocompleteField){
        return !this.state.tags.find(t => (t === listElement[this.props.autocompleteField])) && listElement[this.props.autocompleteField].includes(text);
      }
      else {
        return !this.state.tags.find(t => (t === listElement)) && listElement.includes(text);
      }
      
    })

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
      userInput: text,
});
    
    
  }

  _getListView() {
    const { dataSource, listPosition } = this.state;
    const { listStyle, minCharsToStartAutocomplete } = this.props; 

    if(!this.state.showList || this.state.userInput=="" || this.state.userInput.length < minCharsToStartAutocomplete) {
      return null;
    }

    return (
      
      <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
        <ListView
          style={[styles.list, listStyle]}
          ref='listView'
          keyboardShouldPersistTaps={true}
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={this._renderRow.bind(this) }
          renderSeparator={this._renderSeparator.bind(this) }
          renderFooter={this._renderFooter.bind(this) }
          key={this.state.userInput}
          />
      </ScrollView>
    )
  }

  _removeTag(tag) {
    var newTags = this.state.tags.filter((t) => (t !== tag));
    var filteredList = this.props.suggestions.filter((listElement) => {
      if(this.props.autocompleteField){
        return !this.state.tags.find(t => (t === listElement[this.props.autocompleteField])) && listElement[this.props.autocompleteField].includes(this.state.userInput);
      }
      else {
        return !this.state.tags.find(t => (t === listElement)) && listElement.includes(this.state.userInput);
      }
      
    })
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
    });

    this.props.onChange(newTags);    
  }

  _onChangeLayout(e) {
    let layout = e.nativeEvent.layout;

    this.setState({
      listPosition: {
        top: layout.height+10,
        left: 0,
        right: 0,
      }
    })

    this.props.onUpdateLayout(layout);
  }

  render() {

    const { placeholder, containerStyle, inputContainerStyle, textInputStyle, tagContainerStyle, tagTemplate } = this.props;
    var flex = (this.state.showList) ? {flex: 1} : {flex: 0} 
    
    return (
      <View style={[flex, containerStyle]}>
        <View style={styles.headerContainer}>
          {this.props.title && <Text style={styles.autocompleteTitle}>{this.props.title}</Text>}
          <View ref='tagInput' style={[styles.inputContainer, inputContainerStyle]} onLayout={this._onChangeLayout.bind(this) }>

            { tagTemplate ? this.state.tags.map((tag) => (
              <TouchableHighlight key={tag} style={[styles.tagContainerStyle, tagContainerStyle]} >
                {tagTemplate(tag, this._removeTag.bind(this)) }
              </TouchableHighlight>
            ))
              :
              this.state.tags.map((tag) => (
                <Tag key={tag} text={tag} onPress={this._removeTag.bind(this, tag) } />
              ))
            }

            <TextInput
              ref='textInput'
              style={[styles.textinput, textInputStyle]}
              underlineColorAndroid='transparent'
              placeholder={this.state.tags.length > 0 ? '' : this.props.placeholder}
              placeholderTextColor = {"#bbb"}
              onChangeText={this._onChangeText.bind(this) }
              onFocus={this._onFocus.bind(this) }
              onBlur={this._onBlur.bind(this) }
              autoCorrect={false}
              autoCapitalize='none'
              />
          </View>
          
        </View>
        {this._getListView() }
       </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    
  },
  inputContainer: {
    flexDirection:'row', 
    flexWrap: 'wrap',
    paddingHorizontal: 30,
    borderColor: '#999',
    borderBottomWidth: 1,
    minHeight:20,
  },
  textinput: {
    padding: 0,
    flex: 1,
    fontSize: 14,
    height: 27,
    margin: 3,
    color: "#000",
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingLeft: 30
  },
  newTagText: {
    fontSize: 14,
  },
  separator: {
    height: 0.5,
    alignSelf: 'stretch',
    backgroundColor: '#aaa',
  },
  list: {

  },
  searchedText: {
    color: "#F66400",
    fontWeight: "bold"
  },
  autocompleteTitle: {
    color: "#999",
    fontSize: 14,
    backgroundColor: "#fff",
    marginTop: 20,
    marginLeft: 30,
  },
  newTagContainer: {},
  tagContainerStyle: {
    backgroundColor: '#eee',
    paddingLeft: 5,
    paddingRight: 7,
    paddingVertical: 0,
    margin: 3,
    borderRadius: 15,
    height: 50,
  }
  
});
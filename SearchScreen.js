import React from 'react';
import {StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import db from '../config.js'
import TransactionScreen from './BookTransactionScreen.js';

export default class SearchScreen extends React.Component {
  constructor (){
  super()
  this.state={
    allTransactions:[],
    lastVisibleTransaction: null,
    search: ''
  }
}
componentDidMount=async()=>{
  const query=await db.collection("Transaction").limit(10).get()
  query.docs.map((doc)=>{
this.setState({
allTransactions:[...this.state.allTransactions, doc.data()],
lastVisibleTransaction: doc   
})
  }
  )
}
fetchMoreTransaction=async()=>{
  var text = this.state.search.toUpperCase()
  var enteredText = text.split("")
if (enteredText[0].toUpperCase==="B"){
const transaction = await db.collection("Transaction").where("bookId","==",text).startafter(this.state.lastVisibleTransaction).limit(20).get()
transaction.docs.map((doc)=>{
  this.setState({
    allTransactions:[...this.state.allTransactions, doc.data()],
    lastVisibleTransaction: doc                    
  })
})
} else if (enteredText[0].toUpperCase==="S"){
  const transaction = await db.collection("Transaction").where("studentId","==",text).startafter(this.state.lastVisibleTransaction).limit(20).get()
  transaction.docs.map((doc)=>{
    this.setState({
      allTransactions:[...this.state.allTransactions, doc.data()],
      lastVisibleTransaction: doc                    
    })
  })
  }
}
searchTransactions=async(text)=>{
var enteredText = text.split("")
var text = text.toUpperCase()
if (enteredText[0].toUpperCase==="B"){
const transaction = await db.collection("Transaction").where("bookId","==",text).get()
transaction.docs.map((doc)=>{
  this.setState({
    allTransactions:[...this.state.allTransactions, doc.data()],
    lastVisibleTransaction: doc                    
  })
})
} else if (enteredText[0].toUpperCase==="S"){
  const transaction = await db.collection("Transaction").where("studentId","==",text).get()
  transaction.docs.map((doc)=>{
    this.setState({
      allTransactions:[...this.state.allTransactions, doc.data()],
      lastVisibleTransaction: doc                    
    })
  })
  }
}

    render(){
      return(
        <View style={styles.container}>
          <View styles={styles.SearchBar}>
      <TextInput style={styles.Bar}
      placeholder= "Enter The Student's/Book's ID"
      onChangeText= {(text)=>{this.setState({
        search: text,
      })}}
      />
      <TouchableOpacity style={styles.searchButton} onPress={()=>{this.searchTransactions(this.state.search)}}>
        <Text> 
          Search 
        </Text>
</TouchableOpacity>
      </View>
    <FlatList
    data={this.state.allTransactions}
     renderItem={({item})=>(
           <View style={{borderBottomWidth:3}}>
      <Text>{"Transaction: "+item.transactionType}</Text>
     <Text>{"Student ID: "+item.studentId}</Text>
     <Text>{"Book ID: "+item.bookId}</Text>
     {/* <Text>{"Date: "+Transaction.date.toDate()}</Text> */}
    </View>
     )}
     keyExtractor={(item,index)=>index.toString()}
     onEndReached={this.fetchMoreTransaction}
    onEndReachedThreshold={0.7}
  />
    </View>
    )
}
}
const styles = StyleSheet.create({
  SearchBar:{
flexDirection: 'row',
width: 'auto',
height:20,
borderWidth: 0.5,
alignItems: "center",
backgroundColor: "lightblue"
  },
  container:{
    flex: 1,
    marginTop: 20,
  },
  Bar: {
    width: 270,
    borderWidth: 0.5,
    height:30,
    paddingLeft: 40,
    alignItems: "center"
  },
  searchButton:{
    width: 40,
height:30,
justifyContent: "center",
borderWidth: 0.5,
alignItems: "center",
backgroundColor: "pink"
  }
})
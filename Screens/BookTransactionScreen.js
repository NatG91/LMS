import React from 'react';
import { StyleSheet, Text, View,TextInput, Image, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as firebase from 'firebase';
import db from '../config.js'



export default class TransactionScreen extends React.Component {
 constructor(){
  super()
    this.state={
  hasCameraPermission:null,
  scanned:false,
  buttonState: 'normal',
  scannedBookId: '',
  scannedStudentId: ''
    }
  
}
getCameraPermissions=async(Id)=>{
const {status}=await Permissions.askAsync(Permissions.CAMERA)
this.setState({
  hasCameraPermission: status==="granted",
  buttonState: Id,
  scanned: false
})
}
handleBarCodeScanned = async({type,data})=>{
  const {buttonState}=this.state
  if (buttonState==='BookId'){
    this.setState({
      scanned:true,
      scannedBookId:data,
      buttonState: 'normal',
    })
  } else if (buttonState==='StudentId'){
  this.setState({
    scanned:true,
    scannedStudentId:data,
    buttonState: 'normal',
  })
  }

}
initiateBookIssue=async()=>{
db.collection("Transaction").add({
  'dateIssued':firebase.firestore.TimeStamp.now().toDate(),
  'studentId':this.state.scannedStudentId,
  'bookId':this.state.scannedBookId,
  'transactionType': "Issue"
})
db.collection("Book").doc(this.state.scannedBookId).update({
  'Available':false,
})
db.collection("Student").doc(this.state.scannedStudentId).update({
  'noofBooksIssued': firebase.firestore.FieldValue.increment(1)
})
this.setState({
  scannedBookId: '',
  scannedStudentId:''
})
}

initiateBookReturn=async()=>{
  db.collection("Transaction").add({
    'dateReturn':firebase.firestore.TimeStamp.now().toDate(),
    'studentId':this.state.scannedStudentId,
    'bookId':this.state.scannedBookId,
    'transactionType': "Return"
  })
  db.collection("Book").doc(this.state.scannedBookId).update({
    'Available':true,
  })
  db.collection("Student").doc(this.state.scannedStudentId).update({
    'No. of Books Issued': firebase.firestore.FieldValue.increment(-1)
  })
  this.setState({
    scannedBookId: '',
    scannedStudentId:''
  })
  }

handleTransaction= async()=>{
  var transactionMessage
  db.collection("Book").doc(this.state.scannedBookId).get()
  .then((doc)=>{
    console.log(doc.data())
    var book = doc.data()
    if (book.Available){
      this.initiateBookIssue()
      transactionMessage="The book has been issued."
    } else {
      this.initiateBookReturn()
      transactionMessage= "The book has been returned."
    }
  })
  this.setState({
    transactionMessage: transactionMessage
  })
}
    render(){
      const hasCameraPermission=this.state.hasCameraPermission
      const scanned=this.state.scanned
      const buttonState=this.state.buttonState
      if (buttonState!=='normal' && hasCameraPermission){
return(
<BarCodeScanner onBarCodeScanned={scanned? undefined:this.handleBarCodeScanned}
style={StyleSheet.absoluteFillObject}
/>

)
      }
      else if (buttonState==='normal'){
     return (
       <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
    <View style={styles.container}>
      <View>
      <Image source={require('../assets/booklogo.jpg')}
    style={{width:200,height:200}}/>
    <Text style={{
      textAlign:"center",
      fontSize: 30
      }}>
      LMS
    </Text>
      </View>
      <View style={styles.inputView}>
        <TextInput style={styles.inputBox} placeholder="Book Id" value={this.state.scannedBookId} 
        onChangeText={text=>this.setState({scannedBookId:text})}
        /> 
        <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCameraPermissions('BookId')}}>
          <Text style={styles.buttonText}> Scan </Text>
        </TouchableOpacity>
         </View>
         
         <View style={styles.inputView}>
        <TextInput style={styles.inputBox} placeholder="Student Id" value={this.state.scannedStudentId}
        onChangeText={text=>this.setState({scannedStudentId:text})}
        />
        <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCameraPermissions('StudentId')}}>
          <Text style={styles.buttonText}> Scan </Text>
        </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.submitButton} onPress={async()=>{
           var transactionMessage = await this.handleTransaction()
           
           }}>
           <Text style={styles.submitbuttonText}>
             Submit
           </Text>
         </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
  );
    }
}
}

const styles = StyleSheet.create({
container:{ flex:1,
 justifyContent: "center",
 alignItems: "center"
},
displayText:{
fontSize: 40,
textDecorationLine: "underline",
},
buttonDesign:{
  backgroundColor: "lightblue",
  margin: 20,
  padding: 20
},
buttonText:{
fontSize:15,
textAlign: "center",
marginTop:10,
},
inputView:{
flexDirection: "row",
margin:20,
},
inputBox:{
  width:200,
  height:40,
  borderWidth: 1.5,
  fontSize:20,
  borderLeftWidth: 1
},
scanButton:{
  height:40,
  width:50,
  backgroundColor: "lightblue",
  borderWidth: 1.5,
  borderLeftWidth: 0,
},
submitButton:{
  height: 40,
  width: 100,
  backgroundColor: 'orange',
},
submitbuttonText:{
padding: 10,
textAlign: "center",
fontSize: 15

}
})
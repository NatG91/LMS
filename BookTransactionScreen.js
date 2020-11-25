import React from 'react';
import { StyleSheet, Text, View,TextInput, Image, KeyboardAvoidingView, TouchableOpacity ,ToastAndroid, Alert} from 'react-native';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from 'firebase/app'
import db from '../config.js'

export default class TransactionScreen extends React.Component {
 constructor(){
  super()
    this.state={
  hasCameraPermission:null,
  scanned:false,
  buttonState: 'normal',
  scannedBookId: '',
  scannedStudentId: '',
  transactionMessage: ''
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
  console.log("BookIssue")
db.collection("Transaction").add({
   'date':firebase.firestore.Timestamp.now().toDate(),
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
Alert.alert("Book Issued")
}
initiateBookReturn=async()=>{
  db.collection("Transaction").add({
     'date':firebase.firestore.Timestamp.now().toDate(),
    'studentId':this.state.scannedStudentId,
    'bookId':this.state.scannedBookId,
    'transactionType': "Return"
  })
  db.collection("Book").doc(this.state.scannedBookId).update({
    'Available':true,
  })
  db.collection("Student").doc(this.state.scannedStudentId).update({
    'noofBooksIssued': firebase.firestore.FieldValue.increment(-1)
  })
  this.setState({
    scannedBookId: '',
    scannedStudentId:''
  })
  Alert.alert("Book Return")
  }
  checkStudentEligibilityForIssue= async()=>{
    const studentRef=await db.collection("Student").where("studentId","==",this.state.scannedStudentId).get()
    var isStudentEligible = ""
    if (studentRef.docs.length==0){
      this.setState({
        scannedBookId: '',
        scannedStudentId:''
      }) 
      isStudentEligible=false
      Alert.alert("The student's id does not exist in the database.")
    } else {
      studentRef.docs.map((doc)=>{
        var student= doc.data()
        if(student.noofBooksIssued<2){
          isStudentEligible=true
        } 
        else {
          isStudentEligible=false
          Alert.alert("The student has already issued two books.")
          this.setState({
            scannedBookId: '',
            scannedStudentId:''
          })
        }
      })
    }
    return isStudentEligible
  } 
  checkStudentEligibilityForReturn= async()=>{
    const transactionRef=await db.collection("Transaction").where("bookId","==",this.state.scannedBookId).limit(1).get()
    var isStudentEligible = ""
      transactionRef.docs.map((doc)=>{
        var lastBookTransaction= doc.data()
        if(lastBookTransaction.studentId===this.state.scannedStudentId){
          isStudentEligible=true
        } 
        else {
          isStudentEligible=false
          Alert.alert("This book has not been issued to the student.")
          this.setState({
            scannedBookId: '',
            scannedStudentId:''
          })
        }
      })
    return isStudentEligible
  } 


  checkBookEligibility = async()=>{
  const bookRef = await db.collection("Book").where("bookId","==",this.state.scannedBookId).get()
  var transactionType=""
  if (bookRef.docs.length==0){
    transactionType=false
  } else {
bookRef.docs.map((doc)=>{
  var book=doc.data()
if (book.Available){
transactionType="Issue"
} else {
  transactionType="Return"
}
})
  }
  return transactionType
}


handleTransaction= async()=>{
  var transactionMessage
  var transactionType=await this.checkBookEligibility()
  if (!transactionType){
Alert.alert("This book is not in the library.")
this.setState({
  scannedBookId: '',
  scannedStudentId:''
}) 
  } else if(transactionType==="Issue"){
    var isStudentEligible=await this.checkStudentEligibilityForIssue()
    if (isStudentEligible){
      this.initiateBookIssue()
      Alert.alert("The book has been issued to the student.")
    } 
  } else {
    var isStudentEligible=await this.checkStudentEligibilityForReturn()
    if (isStudentEligible){
      this.initiateBookReturn()
        Alert.alert("The book has been returned by the student.")
    }
  }
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
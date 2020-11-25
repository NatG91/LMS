import React from 'react';
import { StyleSheet, Text, View,TextInput,Image, Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase'

export default class LoginScreen extends React.Component {
  constructor(){
super()
this.state={
  emailId:'',
  Password: ''
}
  }
  login=async(email,password)=>{
if (email && password){   
  console.log("IfEmail:",email)
    console.log("IfPassword:",password)
  try{
    console.log("Email:",email)
    console.log("Password:",password)
const response = await firebase.auth().signInWithEmailAndPassword(email,password)
console.log("response is: ",response)
if(response){
  console.log("Login.")
  this.props.navigation.navigate("Transaction")
}
  }
  catch(error){
switch(error.code){
case 'auth/user-not-found': Alert.alert("This user does not exist.")
console.log("Doesn't Exist.")
break;
case 'auth/invalid-email': Alert.alert("The email address and the password do not match.")
console.log("Invalid.")
}
  }
} else {
  Alert.alert("Enter email address and your password.")
  console.log("Didn't Login.")
}
  }
   render(){
       return(
         <View>
        <View>
        <Image source={require('../assets/booklogo.jpg')}
      style={{width:200,height:200, alignSelf: "center"}}/>
      <Text style={{
        textAlign:"center",
        fontSize: 30
        }}>
        LMS
      </Text>
        </View>
           <View>
               <TextInput style={styles.loginBox} placeholder="abc@example.com" keyboardType="email.address" 
               onChangeText={(text)=>
                {this.setState({
                  emailId:text
                }) }}
               />
               <TextInput style={styles.loginBox} placeholder="Password" secureTextEntry={true}onChangeText={(text)=>
                {this.setState({
                  Password:text
                }) }}/>
               <TouchableOpacity style ={styles.LoginButton} onPress={()=>{this.login(this.state.emailId, this.state.Password)}}>
                <Text>Login</Text>
               </TouchableOpacity>
           </View>
           </View>
       )

   }
   
     
   }
   const styles = StyleSheet.create({
  LoginButton:{
margin: 50,
width: 60,
height: 70,
  },
  loginBox:{
      fontSize: 20,
      height: 20,
      width: 300,
      marginTop: 10,
      marginLeft: 20,
      alignItems: "center",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      alignSelf: "center",
      textAlign: "center"
  },
  LoginButton:{
    fontSize: 90,
    backgroundColor: "lightblue",
    borderRadius: 10,
    height: 20,
    marginTop: 2,
    width: 150,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignSelf: "center",
    textAlign: "center"
  }
    })


import React, {Component} from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableHighlight, ActivityIndicatorIOS } from 'react-native';
import buffer from 'buffer';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProgress: false
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('image!Octocat') } />
                <Text style={styles.heading}>Github browser</Text>
                <TextInput style={styles.input} placeholder="Github username" onChangeText={(text) => this.setState({ username: text }) } />
                <TextInput style={styles.input} placeholder="Github password" secureTextEntry={true} onChangeText={(text) => this.setState({ password: text }) }/>
                <TouchableHighlight style={styles.button} onPress={this.loginPressed.bind(this) }>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableHighlight>
                <ActivityIndicatorIOS animating={this.state.showProgress} size="large" style={styles.loader} />
            </View>
        );
    }

    loginPressed() {
        console.log(this.state);
        this.setState({ showProgress: true });

        var b = new buffer.Buffer(this.state.username + ':' + this.state.password);
        var encoded = b.toString('base64');

        fetch('https://api.github.com/user', { headers: { 'Authorization': 'Basic ' + encoded } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }

                if (response.status == 401) {
                    throw 'Bad Creds';
                }

                throw {
                    badCredentials: response.status == 401,
                    unknownError: response.status != 401    
                };
            })
            .then((response) => { return response.json(); })
            .then((results) => {
                console.log(results);
                this.setState({ showProgress: false });
            })
            .catch((err) => {
                this.setState(err);
            })
            .finally(() => {
                this.setState({ showProgress: false });
            });

    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 40,
        padding: 10,
        alignItems: 'center'
    },
    logo: {
        width: 66,
        height: 55
    },
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    input: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48bbec'
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
    loader: {
        marginTop: 20
    }
});

export default Login;
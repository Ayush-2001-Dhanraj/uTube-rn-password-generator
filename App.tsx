import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const PasswordValidation = Yup.object().shape({
  passLen: Yup.number()
    .required('Password Length is a required parameter')
    .min(4, 'Minimum length should be 4 characters')
    .max(16, 'Maximum length supported is 16 characters'),
});

const App = () => {
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [includeDigits, setIncludeDigits] = useState<boolean>(false);
  const [includeLower, setIncludeLower] = useState<boolean>(false);
  const [includeSymbols, setIncludesSymbols] = useState<boolean>(true);

  const generatePassword = (passwordLength: number) => {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeDigits) characters += '0123456789';
    if (includeLower) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeSymbols) characters += '@_+=^%$#*():<>/.';

    setGeneratedPassword(getPassword(characters, passwordLength));
  };
  const getPassword = (characters: string, passwordLength: number): string => {
    let password = '';
    for (let i = 0; i < passwordLength; i++)
      password += characters.charAt(
        Math.round(Math.random() * characters.length),
      );
    return password;
  };
  const resetPassword = () => {
    setGeneratedPassword('');
    setIncludeDigits(false);
    setIncludeLower(false);
    setIncludesSymbols(true);
  };

  useEffect(() => {
    console.log('Generated Password', generatedPassword);
  }, [generatedPassword]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{padding: 8, gap: 10}}>
        <Text style={styles.header}>Password Generator</Text>
        <Formik
          initialValues={{passLen: ''}}
          validationSchema={PasswordValidation}
          onSubmit={values => {
            generatePassword(+values.passLen);
          }}>
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleSubmit,
            handleReset,
          }) => (
            <>
              <View>
                <TextInput
                  value={values.passLen}
                  onChangeText={handleChange('passLen')}
                  placeholder="Password Length Ex. 4"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
              {touched.passLen && errors.passLen && (
                <Text>{errors.passLen}</Text>
              )}
              <View style={styles.bouncyContainer}>
                <Text style={styles.bouncyText}>Include Lower Case: </Text>
                <BouncyCheckbox
                  useBuiltInState={false}
                  isChecked={includeLower}
                  onPress={() => setIncludeLower(preV => !preV)}
                  style={styles.bouncyCheckbox}
                />
              </View>
              <View style={styles.bouncyContainer}>
                <Text style={styles.bouncyText}>Include Digits: </Text>
                <BouncyCheckbox
                  useBuiltInState={false}
                  isChecked={includeDigits}
                  onPress={() => setIncludeDigits(preV => !preV)}
                  style={styles.bouncyCheckbox}
                />
              </View>
              <View style={styles.bouncyContainer}>
                <Text style={styles.bouncyText}>Include Symbols: </Text>
                <BouncyCheckbox
                  useBuiltInState={false}
                  isChecked={includeSymbols}
                  onPress={() => setIncludesSymbols(preV => !preV)}
                  style={styles.bouncyCheckbox}
                />
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    handleReset();
                    resetPassword();
                  }}>
                  <Text style={styles.btnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  disabled={!isValid}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.btnText}>Generate</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
        {generatedPassword && (
          <View style={styles.passwordContainer}>
            <Text style={styles.generatedPassword} selectable>
              {generatedPassword}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
  },
  btn: {
    padding: 8,
    backgroundColor: '#000',
    flex: 1,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  textInput: {
    borderWidth: 2,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bouncyText: {
    fontSize: 18,
    flex: 1,
  },
  bouncyContainer: {
    flexDirection: 'row',
  },
  bouncyCheckbox: {
    flexDirection: 'column',
  },
  generatedPassword: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  passwordContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    backgroundColor: 'red',
    elevation: 8,
  },
});

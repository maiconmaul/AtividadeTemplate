import React from 'react';
import { View } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import { useAuth } from './context/AuthContext';

const Cadastro = ({ navigation }) => {

    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [confirmarSenha, setConfirmarSenha] = React.useState('');

    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = React.useState(false);
    const [erro, setErro] = React.useState('');
    const [carregando, setCarregando] = React.useState(false);
    const { register } = useAuth();

    const cadastrar = async () => {
        setErro('');
        if (senha !== confirmarSenha) return setErro('As senhas não coincidem.');
        setCarregando(true);
        try {
            await register(nome, email, senha);
            navigation.navigate('Home');
        } catch (error) { setErro(error.message); }
        finally { setCarregando(false); }
    };

    return (

        <View style={styles.cadastroContainer}>

            {/* APPBAR */}

            <Appbar.Header style={styles.header}>

                <Appbar.BackAction
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Cadastro"
                    titleStyle={styles.title}
                />

            </Appbar.Header>


            {/* FORMULÁRIO */}

            <View style={styles.cadastroContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.cadastroTitulo}
                >
                    Criar conta
                </Text>

                {!!erro && <Text style={styles.errorText}>{erro}</Text>}


                <Text
                    variant="bodyLarge"
                    style={styles.cadastroTexto}
                >
                    Preencha os dados abaixo
                </Text>


                {/* NOME */}

                <TextInput
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    left={
                        <TextInput.Icon icon="account" />
                    }
                    style={styles.input}
                />


                {/* E-MAIL */}

                <TextInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={
                        <TextInput.Icon icon="email" />
                    }
                    style={styles.input}
                />


                {/* SENHA */}

                <TextInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarSenha}
                    left={
                        <TextInput.Icon icon="lock" />
                    }
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            onPress={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CONFIRMAR SENHA */}

                <TextInput
                    label="Confirmar senha"
                    placeholder="Digite novamente sua senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarConfirmacao}
                    left={
                        <TextInput.Icon icon="lock-check" />
                    }
                    right={
                        <TextInput.Icon
                            icon={
                                mostrarConfirmacao
                                    ? 'eye-off'
                                    : 'eye'
                            }
                            onPress={() =>
                                setMostrarConfirmacao(
                                    !mostrarConfirmacao
                                )
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CADASTRAR */}

                <Button
                    mode="contained"
                    icon="account-plus"
                    loading={carregando}
                    disabled={carregando}
                    style={styles.cadastroButton}
                    onPress={cadastrar}
                >
                    CADASTRAR
                </Button>


                {/* JÁ POSSUI CONTA */}

                <Button
                    mode="text"
                    icon="login"
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                >
                    JÁ TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Cadastro;

import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

// Ao estender TextInputProps, seu componente aceita automaticamente:
// keyboardType, autoCapitalize, returnKeyType, etc.
interface Props extends TextInputProps {
  secure?: boolean; // Mantemos o seu nome personalizado se quiser
}

export default function AppInput({
  placeholder,
  secure,
  value,
  onChangeText,
  style, // Permitimos passar estilos extras se necessário
  ...rest // Coleta todas as outras propriedades (como keyboardType)
}: Props) {
  return (
    <TextInput
      style={[styles.input, style]} // Combina o estilo padrão com estilos extras
      placeholder={placeholder}
      secureTextEntry={secure}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
      {...rest} // Aplica o restante das propriedades automaticamente
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff", // Adicionado para garantir visibilidade
    fontSize: 16,
  },
});
import { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SerieRepository from '../src/database/serieRepository';

export default function Form() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const editando = id !== undefined;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  const [concluida, setConcluida] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando) {
      return;
    }

    async function carregarSerie() {
      const serie = await SerieRepository.getSerieById(Number(id));

      if (serie === null) {
        Alert.alert('Erro', 'Série não encontrada.');
        router.back();
        return;
      }

      setTitulo(serie.titulo);
      setPlataforma(serie.plataforma);
      setTemporadas(String(serie.temporadas));
      setNota(serie.nota);
      setConcluida(serie.concluida);
    }

    carregarSerie();
  }, [id, editando]);

  function selecionarNota(valor: number) {
    setNota((notaAtual) =>
      notaAtual === valor ? null : valor,
    );
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasNumero = Number(temporadas);

    if (tituloLimpo === '') {
      Alert.alert('Atenção', 'Informe o título da série.');
      return;
    }

    if (plataformaLimpa === '') {
      Alert.alert('Atenção', 'Informe a plataforma.');
      return;
    }

    if (
      temporadas.trim() === '' ||
      !Number.isFinite(temporadasNumero) ||
      temporadasNumero < 0
    ) {
      Alert.alert(
        'Atenção',
        'Temporadas precisa ser um número maior ou igual a 0.',
      );
      return;
    }

    try {
      setSalvando(true);

      if (editando) {
        await SerieRepository.updateSerie(Number(id), {
          titulo: tituloLimpo,
          plataforma: plataformaLimpa,
          temporadas: temporadasNumero,
          nota,
          concluida,
        });
      } else {
        await SerieRepository.createSerie({
          titulo: tituloLimpo,
          plataforma: plataformaLimpa,
          temporadas: temporadasNumero,
          nota,
        });
      }

      router.back();
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar a série.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#F7F5EF]"
      edges={['bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-5"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-sm font-bold text-[#174A3A]">
          Título
        </Text>

        <TextInput
          className="mb-5 rounded-xl border border-[#DDD9CE] bg-white px-4 py-3 text-base text-[#174A3A]"
          placeholder="Ex.: Stranger Things"
          placeholderTextColor="#99968D"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text className="mb-2 text-sm font-bold text-[#174A3A]">
          Plataforma
        </Text>

        <TextInput
          className="mb-5 rounded-xl border border-[#DDD9CE] bg-white px-4 py-3 text-base text-[#174A3A]"
          placeholder="Ex.: Netflix"
          placeholderTextColor="#99968D"
          value={plataforma}
          onChangeText={setPlataforma}
        />

        <Text className="mb-2 text-sm font-bold text-[#174A3A]">
          Temporadas assistidas
        </Text>

        <TextInput
          className="mb-5 rounded-xl border border-[#DDD9CE] bg-white px-4 py-3 text-base text-[#174A3A]"
          placeholder="Ex.: 3"
          placeholderTextColor="#99968D"
          value={temporadas}
          onChangeText={setTemporadas}
          keyboardType="numeric"
        />

        <Text className="mb-3 text-sm font-bold text-[#174A3A]">
          Nota
        </Text>

        <View className="mb-6 flex-row justify-between rounded-xl bg-white px-4 py-4">
          {[1, 2, 3, 4, 5].map((valor) => {
            const selecionada = nota === valor;

            return (
              <TouchableOpacity
                key={valor}
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  selecionada
                    ? 'bg-[#174A3A]'
                    : 'bg-[#E8E5DC]'
                }`}
                onPress={() => selecionarNota(valor)}
              >
                <Text
                  className={`text-lg font-bold ${
                    selecionada
                      ? 'text-white'
                      : 'text-[#174A3A]'
                  }`}
                >
                  ★ {valor}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {editando && (
          <>
            <Text className="mb-3 text-sm font-bold text-[#174A3A]">
              Status
            </Text>

            <TouchableOpacity
              className={`mb-6 rounded-xl px-4 py-4 ${
                concluida === 1
                  ? 'bg-[#C9D8CF]'
                  : 'bg-[#E8E5DC]'
              }`}
              onPress={() =>
                setConcluida((valor) => (valor === 1 ? 0 : 1))
              }
            >
              <Text className="text-center font-bold text-[#174A3A]">
                {concluida === 1
                  ? '✓ Série concluída'
                  : '○ Série em andamento'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          className={`rounded-xl px-4 py-4 ${
            salvando ? 'bg-[#6D8A7D]' : 'bg-[#174A3A]'
          }`}
          onPress={salvar}
          disabled={salvando}
        >
          <Text className="text-center text-base font-bold text-white">
            {salvando
              ? 'Salvando...'
              : editando
                ? 'Salvar alterações'
                : 'Cadastrar série'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
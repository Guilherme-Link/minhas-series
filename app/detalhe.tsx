import { useCallback, useState } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SerieRepository from '../src/database/serieRepository';
import { Serie } from '../src/types/series';

export default function Detalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!id) {
      return;
    }

    setCarregando(true);

    try {
      const resultado = await SerieRepository.getSerieById(Number(id));
      setSerie(resultado);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  async function alternarConclusao() {
    if (!serie) {
      return;
    }

    await SerieRepository.toggleSerieConcluida(serie.id);
    await carregar();
  }

  function editar() {
    if (!serie) {
      return;
    }

    router.push({
      pathname: '/form',
      params: { id: String(serie.id) },
    });
  }

  function confirmarExclusao() {
    if (!serie) {
      return;
    }

    Alert.alert(
      'Excluir série',
      `Deseja realmente excluir "${serie.titulo}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await SerieRepository.deleteSerie(serie.id);
            router.back();
          },
        },
      ],
    );
  }

  if (carregando) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-[#F7F5EF]"
        edges={['bottom']}
      >
        <Text className="text-[#6B6B63]">
          Carregando...
        </Text>
      </SafeAreaView>
    );
  }

  if (!serie) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-[#F7F5EF] px-4"
        edges={['bottom']}
      >
        <Text className="text-center text-lg font-bold text-[#174A3A]">
          Série não encontrada.
        </Text>

        <TouchableOpacity
          className="mt-5 rounded-xl bg-[#174A3A] px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="font-bold text-white">
            Voltar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const concluida = serie.concluida === 1;

  return (
    <SafeAreaView
      className="flex-1 bg-[#F7F5EF]"
      edges={['bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-5"
      >
        <View
          className={`rounded-2xl border p-5 ${
            concluida
              ? 'border-[#B8C7BF] bg-[#E8EEE9]'
              : 'border-[#DDD9CE] bg-white'
          }`}
        >
          <View className="mb-5 flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-2xl font-bold text-[#174A3A]">
                {serie.titulo}
              </Text>

              <Text className="mt-2 text-base text-[#6B6B63]">
                {serie.plataforma}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-2 ${
                concluida
                  ? 'bg-[#C9D8CF]'
                  : 'bg-[#E8E5DC]'
              }`}
            >
              <Text className="text-xs font-bold text-[#174A3A]">
                {concluida ? 'Concluída' : 'Assistindo'}
              </Text>
            </View>
          </View>

          <View className="border-t border-[#DDD9CE] pt-4">
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase text-[#99968D]">
                Temporadas
              </Text>

              <Text className="mt-1 text-base text-[#174A3A]">
                {serie.temporadas}
                {serie.temporadas === 1
                  ? ' temporada'
                  : ' temporadas'}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold uppercase text-[#99968D]">
                Nota
              </Text>

              <Text
                className={`mt-1 text-base ${
                  serie.nota !== null
                    ? 'font-bold text-[#174A3A]'
                    : 'text-[#99968D]'
                }`}
              >
                {serie.nota !== null
                  ? `★ ${serie.nota}/5`
                  : 'Sem nota'}
              </Text>
            </View>

            <View>
              <Text className="text-xs font-bold uppercase text-[#99968D]">
                Cadastrada em
              </Text>

              <Text className="mt-1 text-base text-[#174A3A]">
                {new Date(serie.createdAt).toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 rounded-xl bg-[#174A3A] px-4 py-4"
          onPress={alternarConclusao}
        >
          <Text className="text-center text-base font-bold text-white">
            {concluida
              ? 'Voltar para assistindo'
              : 'Marcar como concluída'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 rounded-xl border border-[#174A3A] bg-transparent px-4 py-4"
          onPress={editar}
        >
          <Text className="text-center text-base font-bold text-[#174A3A]">
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 rounded-xl bg-[#B84A45] px-4 py-4"
          onPress={confirmarExclusao}
        >
          <Text className="text-center text-base font-bold text-white">
            Excluir
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
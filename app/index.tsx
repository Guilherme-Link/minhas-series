import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SerieRepository from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/series';

export default function Home() {
  const router = useRouter();

  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  async function carregar() {
    const resultado = await SerieRepository.getSeries(filtro);
    setSeries(resultado);
  }

  useEffect(() => {
    carregar();
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [filtro]),
  );

  function selecionarFiltro(novoFiltro: SerieFilter) {
    setFiltro(novoFiltro);
  }

  function renderFiltro(
    valor: SerieFilter,
    texto: string,
  ) {
    const ativo = filtro === valor;

    return (
      <TouchableOpacity
        className={`flex-1 rounded-lg px-3 py-3 ${
          ativo ? 'bg-[#174A3A]' : 'bg-[#E8E5DC]'
        }`}
        onPress={() => selecionarFiltro(valor)}
      >
        <Text
          className={`text-center font-bold ${
            ativo ? 'text-white' : 'text-[#174A3A]'
          }`}
        >
          {texto}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderSerie({ item }: { item: Serie }) {
    const concluida = item.concluida === 1;

    return (
      <TouchableOpacity
        className={`mb-3 rounded-xl border p-4 ${
          concluida
            ? 'border-[#B8C7BF] bg-[#E8EEE9]'
            : 'border-[#DDD9CE] bg-white'
        }`}
        onPress={() =>
          router.push({
            pathname: '/detalhe',
            params: { id: String(item.id) },
          })
        }
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text
              className={`text-lg font-bold ${
                concluida
                  ? 'text-[#557064]'
                  : 'text-[#174A3A]'
              }`}
            >
              {item.titulo}
            </Text>

            <Text className="mt-1 text-sm text-[#6B6B63]">
              {item.plataforma}
            </Text>
          </View>

          <View
            className={`rounded-full px-3 py-1 ${
              concluida ? 'bg-[#C9D8CF]' : 'bg-[#E8E5DC]'
            }`}
          >
            <Text className="text-xs font-bold text-[#174A3A]">
              {concluida ? 'Concluída' : 'Assistindo'}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm text-[#6B6B63]">
            {item.temporadas}{' '}
            {item.temporadas === 1 ? 'temporada' : 'temporadas'}
          </Text>

          <Text
            className={`text-sm font-bold ${
              item.nota !== null
                ? 'text-[#174A3A]'
                : 'text-[#99968D]'
            }`}
          >
            {item.nota !== null
              ? `Nota: ${item.nota}/5`
              : 'Sem nota'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#F7F5EF]"
      edges={['bottom']}
    >
      <View className="flex-1 px-4 pt-4">
        <View className="mb-4 flex-row gap-2">
          {renderFiltro('todas', 'Todas')}
          {renderFiltro('assistindo', 'Assistindo')}
          {renderFiltro('concluidas', 'Concluídas')}
        </View>

        <FlatList
          data={series}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderSerie}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 12,
          }}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-[#99968D]">
              Nenhuma série encontrada.
            </Text>
          }
        />

        <TouchableOpacity
          className="mt-3 rounded-xl bg-[#174A3A] px-4 py-4"
          onPress={() => router.push('/form')}
        >
          <Text className="text-center text-base font-bold text-white">
            + Nova série
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

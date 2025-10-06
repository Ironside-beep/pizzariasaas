import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client"
";

const StorePublic = () => {
  const { slug } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      if (!slug) return;

      const { data, error } = await supabase
        .from("profiles") // usa a tabela que contém o slug
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Erro ao buscar loja:", error);
      } else {
        setStore(data);
      }
      setLoading(false);
    }

    fetchStore();
  }, [slug]);

  if (loading) return <p className="p-4 text-center">Carregando...</p>;
  if (!store) return <p className="p-4 text-center">Pizzaria não encontrada 😕</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{store.store_name}</h1>
      <p className="text-gray-600 mb-1">📍 {store.location}</p>
      <p className="text-gray-600 mb-1">📱 {store.whatsapp}</p>
      <p className="text-gray-600 mb-1">
        🕒 {store.open_time} - {store.closing_time}
      </p>

      {/* Aqui depois você vai puxar o cardápio e promoções */}
      <div className="mt-6">
        <p className="text-gray-500 italic">
          (Aqui você pode renderizar os menus e promoções dessa pizzaria)
        </p>
      </div>
    </div>
  );
};

export default StorePublic;

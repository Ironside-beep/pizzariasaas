-- Criar tabela de perfis de usuários/pizzarias
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  store_name text NOT NULL DEFAULT 'Pizza Delivery',
  whatsapp text NOT NULL DEFAULT '5511999999999',
  instagram text NOT NULL DEFAULT '@pizzadelivery',
  location text NOT NULL DEFAULT 'https://maps.google.com',
  delivery_time text NOT NULL DEFAULT '40-60 minutos',
  opening_time text NOT NULL DEFAULT '18:00',
  closing_time text NOT NULL DEFAULT '23:00',
  operating_days integer[] NOT NULL DEFAULT ARRAY[0, 2, 3, 4, 5, 6],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Criar tabela de horários de funcionamento
CREATE TABLE public.store_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day text NOT NULL,
  time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Criar tabela de itens do menu
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('pizza-salgada', 'pizza-doce', 'esfirra-salgada', 'esfirra-doce', 'bebidas')),
  price_broto numeric(10,2),
  price_grande numeric(10,2),
  price numeric(10,2),
  observations text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Criar tabela de promoções
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  items text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles (usuário pode ver e editar apenas seu próprio perfil)
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas RLS para store_hours
CREATE POLICY "Users can view their own store hours"
  ON public.store_hours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own store hours"
  ON public.store_hours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own store hours"
  ON public.store_hours FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own store hours"
  ON public.store_hours FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para menu_items
CREATE POLICY "Users can view their own menu items"
  ON public.menu_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own menu items"
  ON public.menu_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own menu items"
  ON public.menu_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own menu items"
  ON public.menu_items FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para promotions
CREATE POLICY "Users can view their own promotions"
  ON public.promotions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own promotions"
  ON public.promotions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own promotions"
  ON public.promotions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own promotions"
  ON public.promotions FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas públicas para visitantes do site (podem ver todos os dados de todas as pizzarias)
CREATE POLICY "Public can view all profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view all store hours"
  ON public.store_hours FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view all menu items"
  ON public.menu_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view all promotions"
  ON public.promotions FOR SELECT
  TO anon
  USING (true);

-- Função para criar perfil automaticamente ao registrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, store_name)
  VALUES (new.id, 'Minha Pizzaria');
  
  INSERT INTO public.store_hours (user_id, day, time)
  VALUES (new.id, 'Terça a Domingo', '18h - 23h');
  
  RETURN new;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para atualizar updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
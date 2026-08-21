import { products } from "./products";

const OLIST_TOKEN = process.env.OLIST_TOKEN || "";
const OLIST_API_BASE = "https://api.tiny.com.br/api2";

export function slugToOlistId(slug: string): number | null {
  const product = products.find((p) => p.slug === slug);
  return product?.olistId ?? null;
}

export function olistIdToSlug(olistId: number): string | null {
  const product = products.find((p) => p.olistId === olistId);
  return product?.slug ?? null;
}

export type OlistProduct = {
  id: number;
  nome: string;
  codigo: string;
  saldo: number;
  saldoReservado: number;
};

export type OlistOrder = {
  id: number;
  situacao: string;
  data_pedido: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  };
  itens: Array<{
    idProduto: number;
    nome: string;
    quantidade: number;
    valorUnitario: number;
  }>;
  enderecoEntereco: {
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
};

export async function getStock(productId: number): Promise<number | null> {
  if (!OLIST_TOKEN) {
    console.error("OLIST_TOKEN not configured");
    return null;
  }

  try {
    const res = await fetch(
      `${OLIST_API_BASE}/produto.obter.estoque.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${OLIST_TOKEN}&id=${productId}&formato=JSON`,
      }
    );

    const data = await res.json();

    if (data.retorno?.status === "OK") {
      return data.retorno.produto?.saldo ?? 0;
    }

    console.error("Olist stock error:", data.retorno?.erros);
    return null;
  } catch (err) {
    console.error("Olist stock fetch error:", err);
    return null;
  }
}

export async function createOrder(order: {
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  };
  itens: Array<{
    idProduto: number;
    quantidade: number;
    valorUnitario: number;
  }>;
  endereco: {
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}): Promise<number | null> {
  if (!OLIST_TOKEN) {
    console.error("OLIST_TOKEN not configured");
    return null;
  }

  const xmlItems = order.itens
    .map(
      (item) =>
        `<item>
          <idProduto>${item.idProduto}</idProduto>
          <quantidade>${item.quantidade}</quantidade>
          <valorUnitario>${item.valorUnitario}</valorUnitario>
        </item>`
    )
    .join("");

  const xml = `<pedido>
    <cliente>
      <nome>${order.cliente.nome}</nome>
      <email>${order.cliente.email}</email>
      <telefone>${order.cliente.telefone}</telefone>
    </cliente>
    <itens>${xmlItems}</itens>
    <enderecoEntrega>
      <endereco>${order.endereco.endereco}</endereco>
      <numero>${order.endereco.numero}</numero>
      <complemento>${order.endereco.complemento || ""}</complemento>
      <bairro>${order.endereco.bairro}</bairro>
      <cidade>${order.endereco.cidade}</cidade>
      <uf>${order.endereco.uf}</uf>
      <cep>${order.endereco.cep}</cep>
    </enderecoEntrega>
  </pedido>`;

  try {
    const res = await fetch(
      `${OLIST_API_BASE}/pedidos.incluir.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${OLIST_TOKEN}&pedido=${encodeURIComponent(xml)}&formato=JSON`,
      }
    );

    const data = await res.json();

    if (data.retorno?.status === "OK") {
      const orderId = data.retorno.pedido?.id;
      console.log(`Olist: order created #${orderId}`);
      return orderId;
    }

    console.error("Olist order error:", data.retorno?.erros);
    return null;
  } catch (err) {
    console.error("Olist order fetch error:", err);
    return null;
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: "Aprovado" | "Cancelado"
): Promise<boolean> {
  if (!OLIST_TOKEN) {
    console.error("OLIST_TOKEN not configured");
    return false;
  }

  try {
    const res = await fetch(
      `${OLIST_API_BASE}/pedidos.alterar.situacao.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${OLIST_TOKEN}&id=${orderId}&situacao=${status}&formato=JSON`,
      }
    );

    const data = await res.json();

    if (data.retorno?.status === "OK") {
      console.log(`Olist: order #${orderId} status updated to ${status}`);
      return true;
    }

    console.error("Olist status update error:", data.retorno?.erros);
    return false;
  } catch (err) {
    console.error("Olist status update fetch error:", err);
    return false;
  }
}

export async function getOrder(
  orderId: number
): Promise<Record<string, any> | null> {
  if (!OLIST_TOKEN) return null;

  try {
    const res = await fetch(`${OLIST_API_BASE}/pedidos.obter.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${OLIST_TOKEN}&id=${orderId}&formato=JSON`,
    });
    const data = await res.json();
    if (data.retorno?.status === "OK") {
      return data.retorno.pedido ?? null;
    }
    return null;
  } catch (err) {
    console.error("Olist getOrder error:", err);
    return null;
  }
}

export async function searchOrders(
  filters: { situacao?: string; dataInicio?: string; dataFim?: string; pagina?: number } = {}
): Promise<{ pedidos: Record<string, any>[]; totalPaginas: number }> {
  if (!OLIST_TOKEN) return { pedidos: [], totalPaginas: 0 };

  const params = new URLSearchParams();
  params.set("token", OLIST_TOKEN);
  params.set("formato", "JSON");
  if (filters.situacao) params.set("situacao", filters.situacao);
  if (filters.dataInicio) params.set("dataInicio", filters.dataInicio);
  if (filters.dataFim) params.set("dataFim", filters.dataFim);
  params.set("pagina", String(filters.pagina || 1));

  try {
    const res = await fetch(`${OLIST_API_BASE}/pedidos.pesquisa.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    if (data.retorno?.status === "OK") {
      const registros = data.retorno.registros || [];
      return {
        pedidos: registros.map((r: Record<string, any>) => r.pedido || r),
        totalPaginas: data.retorno.pagina_atual
          ? Math.ceil(data.retorno.total_registros / 50)
          : 1,
      };
    }
    return { pedidos: [], totalPaginas: 0 };
  } catch (err) {
    console.error("Olist searchOrders error:", err);
    return { pedidos: [], totalPaginas: 0 };
  }
}

export async function getProduct(olistId: number): Promise<Record<string, any> | null> {
  if (!OLIST_TOKEN) return null;

  try {
    const res = await fetch(`${OLIST_API_BASE}/produto.obter.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${OLIST_TOKEN}&id=${olistId}&formato=JSON`,
    });
    const data = await res.json();
    if (data.retorno?.status === "OK") {
      return data.retorno.produto ?? null;
    }
    return null;
  } catch (err) {
    console.error("Olist getProduct error:", err);
    return null;
  }
}

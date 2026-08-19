const OLIST_TOKEN = process.env.OLIST_TOKEN || "";
const OLIST_API_BASE = "https://api.tiny.com.br/api2";

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

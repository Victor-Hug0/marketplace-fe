import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/text-field";

const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export function AddressForm() {
  return (
    <form
      className="grid gap-4 border border-line bg-surface p-4 md:grid-cols-2"
      noValidate
    >
      <TextField
        id="recipient_name"
        name="recipient_name"
        label="Quem recebe"
        defaultValue="Maria Souza"
        autoComplete="name"
      />
      <TextField
        id="phone"
        name="phone"
        label="Telefone"
        defaultValue="11987654321"
        autoComplete="tel"
        inputMode="numeric"
      />
      <TextField
        id="cep"
        name="cep"
        label="CEP"
        defaultValue="013"
        autoComplete="postal-code"
        inputMode="numeric"
        error="O CEP informado é inválido."
      />
      <TextField
        id="street"
        name="street"
        label="Logradouro"
        defaultValue="Avenida Paulista"
        autoComplete="address-line1"
      />
      <TextField id="number" name="number" label="Número" defaultValue="1000" />
      <TextField
        id="complement"
        name="complement"
        label="Complemento"
        defaultValue="Apto 12"
      />
      <TextField
        id="district"
        name="district"
        label="Bairro"
        defaultValue="Bela Vista"
      />
      <TextField
        id="city"
        name="city"
        label="Cidade"
        defaultValue="São Paulo"
        autoComplete="address-level2"
      />
      <SelectField
        id="state"
        name="state"
        label="Estado"
        defaultValue="SP"
        autoComplete="address-level1"
      >
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </SelectField>
      <div className="md:col-span-2">
        <Button type="submit">Salvar endereço</Button>
      </div>
    </form>
  );
}

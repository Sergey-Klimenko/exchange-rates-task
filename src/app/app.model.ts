export class Source {
  url: string;
  type: 'xml' | 'json';
}

export class JsonVALCURSResponse {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: Map<string, ValuteJson>;
}

export class XmlVALCURSResponse {
  VALCURS: Valcurs;
}

export class Valcurs {
  $: Info;
  VALUTE: ValuteXml[];
}

export class Info {
  DATE: string;
  NAME: string;
}

export class ValuteXml {
  $: { ID: string };
  CHARCODE: string[];
  NAME: string[];
  NOMINAL: string[];
  NUMCODE: string[];
  VALUE: string[];
}

export class ValuteJson {
  ID: string;
  CharCode: string;
  Name: string;
  Nominal: number;
  NumCode: string;
  Previous: number;
  Value: number;
}

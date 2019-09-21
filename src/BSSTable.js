import React from 'react';

import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection,
  headerCol,
  TableVariant,
  expandable,
  cellWidth
} from '@patternfly/react-table';

function parseJSON(obj)
{
    console.log("parseJSON obj=%o", obj);
    console.log("parseJSON keys=%o", Object.keys(obj));
    return Object.keys(obj).map(key => Object.assign({}, obj[key], {'key':key, 'id':key}));
}

function checkStatus(response)
{
    console.log("checkStatus ok=%o status=%o", response.ok, response.status);
    return response.json();
}

function getScan(success)
{
    let url = 'http://localhost:5000/scan'
    url = 'http://172.19.9.42:5000/scan'
    return fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);

}

//class TableRow extends React.Component
//{
//    render() {
//        console.log("TableRow props=%o", this.props);
//        const ssid = this.props.bss.ies[0].value.SSID;
//        return (
//            <tr>
//                <td key={this.props.bss.id + "_bssid"}>{this.props.bss.bssid}</td>
//                <td key={this.props.bss.id+"_ssid"}>{ssid}</td>
//            </tr>
//        );
//    }
//
//}

// https://www.patternfly.org/v4/documentation/react/components/table/
class BSSTable extends React.Component
{
//    state = {
//        bsslist : [],
//    };

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'BSSID', transforms: [sortable] },
        { title: 'SSID', transforms: [sortable] },
        { title: 'Frequency', transforms: [sortable] },
        { title: 'RSSI', transforms: [sortable] },
      ],
      rows: [],
      sortBy: {}
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(_event, index, direction) {
    const sortedRows = this.state.rows.sort((a, b) => (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0));
    this.setState({
      sortBy: {
        index,
        direction
      },
      rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    });
  }

    onScanFetch = (dump) => {
        console.log("onScanFetch dump=%o", dump);
        const new_rows = dump.map(bss => 
            [bss['bssid'], 
             bss.ies[0].value.SSID,
             bss['frequency'].toString(),
             bss['signal']['value'].toString(),
            ]
        );
        console.log("onScanFetch new_rows=%o", new_rows);
        
        this.setState( Object.assign({}, this.state, {'rows':new_rows,}) );
    }

    componentDidMount() {
        console.log("table mounted");
        getScan(this.onScanFetch);
    }

    componentWillUnmount() {
        console.log("table unmount");
    }

    render() {
//        console.log("Table render state=%o", this.state);
//        const bsslist = this.state.bsslist.map((bss) => (
//                    <TableRow key={bss.bssid} bss={bss} />
//                ));

        console.log("render state=%o", this.state);
        const { columns, rows, sortBy } = this.state;

//        rows.map((row) => console.log(row));

        return (
          <Table caption="Sortable Table" variant={TableVariant.compact} sortBy={sortBy} onSort={this.onSort} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
        );
    }

}


export default BSSTable;
// vim: ts=4:sts=4:et

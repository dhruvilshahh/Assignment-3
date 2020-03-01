class ProductFilter extends React.Component {
  render() {
    return React.createElement("div", null, "Showing all available products.");
  }

}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      name: form.name.value,
      price: form.price.value.replace('$', ''),
      image: form.image.value,
      category: form.category.value
    };
    this.props.createIssue(issue);
    form.name.value = "";
    form.price.value = "$";
    form.image.value = "";
    form.category.text = "";
  }

  render() {
    return React.createElement("form", {
      method: "POST",
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      id: "section-1"
    }, React.createElement("p", null, " Product Name ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "name"
    })), React.createElement("p", null, "Price Per Unit ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      placeholder: "price",
      defaultValue: "$"
    })), React.createElement("button", null, "Add Product ")), React.createElement("div", {
      id: "section-2"
    }, React.createElement("p", null, " Category ", React.createElement("br", null), React.createElement("select", {
      name: "category"
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), React.createElement("p", null, " Image URL ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "image"
    }))));
  }

}

class ProductRow extends React.Component {
  render() {
    const issue = this.props.issue;
    return React.createElement("tr", null, React.createElement("td", null, issue.name), React.createElement("td", null, "$", issue.price), React.createElement("td", null, issue.category), React.createElement("td", null, React.createElement("a", {
      href: issue.image,
      target: "_blank"
    }, "View")));
  }

}

class ProductTable extends React.Component {
  render() {
    const issueRows = this.props.issues.map(issue => React.createElement(ProductRow, {
      key: issue.id,
      issue: issue
    }));
    return React.createElement("div", null, React.createElement("table", {
      className: "bordered-table"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, issueRows)), React.createElement("br", null), React.createElement("div", null, " Add a new product to inventory. "));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      ProductList {
        name price category image
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const body = await response.text();
    const result = JSON.parse(body);
    this.setState({
      issues: result.data.ProductList
    });
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: productInputs!) {
      productAdd(issue: $issue) {
        id
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          issue
        }
      })
    });
    this.loadData();
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My Company Inventory"), React.createElement(ProductFilter, null), React.createElement("hr", null), React.createElement(ProductTable, {
      issues: this.state.issues
    }), React.createElement("hr", null), React.createElement(ProductAdd, {
      createIssue: this.createIssue
    }));
  }

}

const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));
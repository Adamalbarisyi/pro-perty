import React, { Component } from 'react';
import millify from 'millify';
import { Card, Button, Container } from 'react-bootstrap';
import { Row} from 'react-bootstrap';
//import HeaderSearch from '../../components/HeaderSearch'
import AsyncFetch from '../../api/AsyncFetch'
import queryString from 'query-string';
import ScrollToTop from 'react-router-scroll-top'   
import Oops from '../../assets/oops.png'
import {Link } from "react-router-dom";

export default class ListIklan extends Component {
  constructor(props){
    super(props);
    
    this.state = {
        data: [],
        visible:4,
        error:false,
        url: "",
        url_data: "",
        isFlushed: false
    }
    this.loadMore = this.loadMore.bind(this);
}

loadMore() {
    this.setState((prev) => {
      return {visible: prev.visible + 4};
    });
  }


  setStateAsync(state) {
      return new Promise(resolve => {
          this.setState(state, resolve)
      })
  }

  async componentDidMount(){
      console.log("Component A Will Mount")
      const url = this.state.url
      console.log(url)        
      console.log("SetState with AsyncFetch")
      await this.setStateAsync({
          isLoad: true,
          ...await AsyncFetch(url)
      })
  }

// set default state of isFlushed = false, which means it's ready for data flushing

componentWillReceiveProps(nextProps) {
  // check current props and nextPros of dealLoaded flag. If dealLoaded was false, and is true, which means the data is fetched, then we should reset isFlushed
  if (!this.props.dealLoaded && nextProps.dealLoaded) {
    this.setState({
      isFlushed: false
    });
  }
  // since we assigned the location.state in <Link>, if we see this prop, and the data is not flushed yet, then flush data, in this case we call loadDeals(), which is a redux action
  if (!this.state.isFlushed && nextProps.location.state === 'flushDeal') {
     window.location.reload();
    this.setState({
      isFlushed: true,
      isLoad: true,
    }, () => this.componentWillMount(), this.componentDidMount(), this.setStateAsync())
  }
}


  async componentWillMount() {

    let url_ku = this.props.location.search;
     let params = queryString.parse(url_ku);
     console.log(params);
      console.log(params.alamat)
      let url_api='http://apiproday.herokuapp.com/api/v1/search?kategori=semua&provinsi=semua&'
      let provinsi='kab='+params.alamat
      let cari ='&cari='+params.cari
      this.setState({url:url_api+provinsi+cari})
      console.log(this.state.url_data)
  }
  ambilangka(value) {
      return millify(value, {
          precision: 2,
          decimalSeparator: ',',
          units: ['', 'Ribu', 'Juta', 'Milyar', 'Triliun'],
          space: true,
      })
  }
  nego(value) {
      if (value === 'true') {
          return "Nego"
      } else {
          return ""
      }
  }

  render () {
     let children = []
           if (this.state.isLoad) {
               children = this.state.data
               console.log(children)
           }else {

           }
    if (this.state.data && this.state.data.length) {
       return (
            <React.Fragment>
             
         

    <ScrollToTop/>
              <center>  
                <Container style={{ paddingLeft:10}} className="list_div_search">   

                <div style={{marginLeft:15}} className="list_div_search">
                <h5 style={{color:'#95a5a6'}}>Ditemukan : {this.state.data.length} Data</h5>
                <br/>
                <Row> 
        { ! this.state.isLoad && <label>Loading ... </label> }
       
            { this.state.isLoad && children.slice(0, this.state.visible).map((value, index) => 
            <React.Fragment >
              <center>
                
             <Card style={{ width: '17rem',margin:5}} id={'ListIklan'} key={value.id}>
                    
                        <Card.Img  style={{height:200}} variant="top" src={value.foto} onError={(e) => {
                        e.target.src = 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png' // some replacement image
                         }} />
                 
                       <Card.Body style={{background:'#fcf4f4'}}>
                        <Card.Title style={{fontWeight:300,float:'left'}}>
                        <h6 style={{fontWeight:400,fontSize:'1.1rem'}} className="text_title">
                        {(value.title.substring(0,25)+'..')}
                        </h6>
                        </Card.Title>
                        
                        <br/>
                        <br/>
                        <Card.Subtitle className="mb-2 text-muted" style={{float:'left',marginTop:-20}}>{value.alamat}</Card.Subtitle>
                        <br/>
                        <Card.Title style={{color: '#de5e5e',marginTop:25, marginBottom:25, fontWeight:500, float: 'left'}}>
                        Rp {this.ambilangka(value.harga)}
                            <h2 style={{fontSize:15, color: '#95a5a6', float: 'right', marginLeft:10}}> {this.nego(value.nego)}</h2>
                        </Card.Title>
                        <Link to={{ pathname: '/DetailIklan',
                      search:'?cari='+value.title+'&id='+value.id,
                      state: 'flushDeal' }}  style={{textDecoration: 'none'}}>   
                        <Button  variant="outline-warning" style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'center'}}>
                        Hubungi Penjual</Button>
                        </Link>
                        
                    </Card.Body>
                </Card>
              
               
                </center>
            </React.Fragment>

              )  }
            </Row>
            {this.state.visible < this.state.data.length &&
                <button onClick={this.loadMore} type="button" className="load-more">Load more</button>}
            
            </div>
          </Container>
          </center>
      </React.Fragment>
           
      );
    }else {
       return (
           <React.Fragment>
                <Container style={{display: 'flex', paddingLeft:10}} >
               <div style={{marginLeft:15}} className="list_div">
              <center>
              <div className="show_not_found" style={{width:'100%'}}>
                <img src={Oops} style={{width:200}} alt="logo"/>
                <h2>Oops Data Masih Belum Ada </h2>
              </div>
              </center>
            </div>
          </Container>
      </React.Fragment>
        );

    }

     
   
   
  }
}
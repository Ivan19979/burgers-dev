import { Component, HostListener } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currency = "$";
  totalPrice = 0;
  loaderShowed = true;
  loader = true;
  orderImageStyle: any;
  mainImageStyle: any;

  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  });

  productsData: any;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent){
    this.orderImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3) / 8) + 'px,-' + ((e.clientY * 0.3) / 8) + 'px)'};
    this.mainImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3) / 8) + 'px,-' + ((e.clientY * 0.3) / 8) + 'px)'};
  }

  ngOnInit(){
    setTimeout(()=>{
      this.loaderShowed = false;
    }, 3000);
    setTimeout(()=>{
      this.loader = false;
    }, 4000);


    this.appService.getData().subscribe(data => this.productsData = data)
  }

  scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if(burger){
      if(this.form.value.order !== ""){
        this.form.patchValue({order: this.form.value.order + ', ' + burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
      } else {
        this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
      }
      this.totalPrice += burger.price;
    }
  }

  confirmOrder(){
    if(this.form.valid){
      this.appService.sendOrder(this.form.value)
          .subscribe(
              {
                next:(response: any) => {
                  alert(response.message);
                  this.form.reset();
                },
                error:(response) => {
                  alert(response.error.message);
                },
              }
          );
      // alert(this.form.value.name + ", Ваш заказ на сумму " + this.totalPrice + " " + this.currency + " сформирован\nСпасибо за заказ!\nМы скоро свяжемся с вами по номеру: " + this.form.value.phone + " для уточнения деталей!");
      // this.form.reset();
    }
  }

  changeCurrency(){
    let newCurrency = '$';
    let coefficient = 1;
    if(this.currency === '$'){
      newCurrency = "₽";
      coefficient = 80;
    } else if(this.currency === "₽"){
      newCurrency = "BYN";
      coefficient = 3;
    } else if(this.currency === "BYN"){
      newCurrency = "€";
      coefficient = 0.9;
    } else if(this.currency === "€"){
      newCurrency = "¥";
      coefficient = 6.9;
    }
    this.currency = newCurrency;

    this.productsData.forEach((item: any)=>{
      item.price = +(item.basePrice * coefficient).toFixed(1);
    })
  }

}










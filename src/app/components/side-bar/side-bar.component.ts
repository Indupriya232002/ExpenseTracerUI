import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesService } from 'src/app/services/expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @ViewChild('content') content: any;
  expenseForm!: FormGroup;
  isSubmitted = false;

  expenseData :any;
  startDate: string = '';
  isUpdate = false;
  endDate: string = '';
  expensiveList = [];
  listForMonth = [];
  headName = "Expensive Analysis";
  constructor(private fb: FormBuilder, private modalService: NgbModal,private expenseService: ExpensesService,private router: Router) {
   }
  isSidebarExpanded = false;
  switchScreen: number = 1;
  chartOptions: echarts.EChartsOption;
  barChartOptions:echarts.EChartsOption;
  chartForMonthly:echarts.EChartsOption;
  ngOnInit(): void {
    this.switchScreen = 1;
    this.expenseData = { name: '', category: '', expenditure: null, date: '' };
    this.getExpenses();
  }

  onClickHome() {
    this.switchScreen = 1;
    this.headName = "Expensive Analysis";
    this.expensiveList = [];
    this.getExpenses();
    this.prepareHomePage();
  }

  prepareHomePage() {
    if(this.expensiveList?.length > 0){
      var graphList = this.expensiveList.map(x => {
        return {
          value: x.expenditure,
          name: x.name
        }
      })
      this.chartOptions = 
      {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#333', // Darker background for contrast
          textStyle: {
            color: '#fff' // Keep text white
          }
        },
        legend: {
          top: '3%',
          left: 'center',
          textStyle: {
            color: '#fff', // Tooltip text color
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                color:'white',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: graphList
          }
        ]
      };
    }
  }

  getDailyExpenses() {
    const token = localStorage.getItem('token');
    if (token) {
      this.expenseService.getDailyExpenses().subscribe((res) => {
        this.expensiveList = res.expenses.map(x => {
          return{
            ...x,
            date : x.date.split("T")[0],
          }
        });
        this.prepareHomePage();
        this.barGraph();
      }, (error) => {
        console.error('Error fetching tasks', error);
        // Optionally handle navigation if not authorized
        if (error.status === 401) {
          this.router.navigate(['/login']); // Redirect to login if token is invalid
        }
      });
    }
    else {
      console.error('No userId or token found in local storage');
      this.router.navigate(['/login']); // Redirect to login if no userId or token
    }
  }

  onClickDaily() {
    this.expensiveList = [];
    this.getDailyExpenses();
    this.switchScreen = 3;
    this.headName = "Daily Analysis";
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD for input[type="date"]
  }

  barGraph(){
    if (this.expensiveList?.length > 0) {
      // Mapping data for bar chart
      const barChartLabels = this.expensiveList.map(x => x.name);
      const barChartData = this.expensiveList.map(x => x.expenditure);

      // Bar Chart Configuration
      this.barChartOptions = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#333', // Darker background for contrast
          textStyle: {
            color: '#fff' // Keep text white
          }
        }, 
        xAxis: {
          type: 'category',
          data: barChartLabels,
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' }
        },
        series: [
          {
            name: 'Expenditure',
            type: 'bar',
            data: barChartData,
            itemStyle: {
              borderRadius: [5, 5, 0, 0], // Rounded corners for bars
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3
            }
          }
        ]
      };
    }
  }

filterExpenses(): void {
  const token = localStorage.getItem('token') || '';
  this.expenseService.getExpensesByDateRange(this.startDate, this.endDate,token).subscribe(response => {
    let data = JSON.parse(JSON.stringify(response)) || []; // Ensure it's not undefined
    this.expensiveList = data[0].expenses.map(x => {
      return{
        ...x,
        date : x.date.split("T")[0],
      }
    });
    var graphList = this.expensiveList.map(x => {
      return {
        value: x.expenditure,
        name: x.name
      }
    })
    this.chartForMonthly = 
    {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#333', // Darker background for contrast
        textStyle: {
          color: '#fff' // Keep text white
        }
      },      
      legend: {
        top: '3%',
        left: 'center',
        textStyle: {
          color: '#fff', // Tooltip text color
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              color:'white',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: graphList
        }
      ]
    }
    this.expensiveList = [];
  });
}

onClickMonth() {
  this.expensiveList = [];
  this.switchScreen = 2;
  this.headName = "Monthly Analysis";
  const today = new Date();
  // Set startDate to first day of the month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  this.startDate = this.formatDate(firstDay);
  
  // Set endDate to last day of the month
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  this.endDate = this.formatDate(lastDay);
  this.filterExpenses(); 
}  


  getExpenses(){
  const token = localStorage.getItem('token');
  if (token) {
    this.expenseService.getUserExpenses(token).subscribe((res) => {
      this.expensiveList = res.map(x => {
        return{
          ...x,
          date : x.date.split("T")[0],
        }
      });
      this.prepareHomePage();
    },(error) => {
      console.error('Error fetching tasks', error);
      // Optionally handle navigation if not authorized
      if (error.status === 401) {
        this.router.navigate(['/login']); // Redirect to login if token is invalid
      }
    });
  } 
  else {
    console.error('No userId or token found in local storage');
    this.router.navigate(['/login']); // Redirect to login if no userId or token
  }
    
  }

  addExpensive(content:any) {
    this.isUpdate = false;
    this.modalService.open(this.content, { centered: true, size: 'md' });
    this.isSubmitted = false; // Reset validation on modal open
    this.expenseData = { name: '', category: '', expenditure: null, date: '' };
  }

  deleteExpense(expenseId: number) {
    if (!expenseId) {
      console.error('Error: expenseId is undefined');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this expense!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#222',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.deleteExpenseById(expenseId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your expense has been deleted.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              background: '#222',
              color: '#fff'
            });
  
            // Refresh expense list
            this.getExpenses();
            this.switchScreen =1;
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete the expense. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33',
              background: '#222',
              color: '#fff'
            });
          }
        });
      }
    }).catch((error) => console.error('Swal error:', error)); // Catch any Swal issues
  }

  onClickLogout(){
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.router.navigate(['/welcome']);
  }


  onSubmit() {
    this.isSubmitted = true;
    if(this.isUpdate == true){
      this.expenseService.updateExpenses(this.expenseData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'Expense update successfully',
            icon: 'success',
            confirmButtonText: 'OK!',
            allowOutsideClick: false,
            background: '#222', // Dark theme
            color: '#fff' // White text
          });
  
          this.expenseData = { name: '', category: '', expenditure: null, date: '' };
          this.isSubmitted = false;
          this.modalService.dismissAll();
          this.onClickHome();
        },
        error: (error) => console.error('Error:', error)
      });
    }
    else{
      this.expenseService.addExpense(this.expenseData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'Expense added successfully',
            icon: 'success',
            confirmButtonText: 'OK!',
            allowOutsideClick: false,
            background: '#222', // Dark theme
            color: '#fff' // White text
          });
  
          this.expenseData = { name: '', category: '', expenditure: null, date: '' };
          this.isSubmitted = false;
          this.modalService.dismissAll();
          this.onClickHome();
        },
        error: (error) => console.error('Error:', error)
      });
    }
  }

  updateExpensive(data,content){
    this.isUpdate = true;
    this.modalService.open(content, { centered: true, size: 'md' });
    this.expenseData = data;
    this.expenseData.date = data.date?.split("T")[0];
  }
}



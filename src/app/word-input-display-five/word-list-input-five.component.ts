import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModule } from '../app.module'; // yoannes
import Swal from 'sweetalert2';


var global_error = 0;
var global_correct = 0;
var   myUserInputList =  ""; //yoannes
const win: Window = window;

@Component({
  selector: 'app-word-list-input-five',
  templateUrl: './word-list-input-five.component.html'
})
export class WordListInputFiveComponent implements OnInit {
  @Input() data: any;

  interval: any;
  fromDataList: string = '';
  inputForm!: FormGroup;
  correctWord: string = '';
  errorMessage: string = '';
  userInputs: string = '';
  words = 0;

  //yoannes
  studyID: string = '';
  numberOfWords = 40;
  numberCorrectPairs = 0;
  current_date = new Date().toISOString(); 
  percentage = 0;
  listOfPairs ="power - ruler,butterfly - bloom,dream - reality,language - acoustic,examiner - failure,coach - horse,animal - frog,demand - difficulty,question - objection,grass - cattle,decency - custom,welcoming - kindness,criticism - doubt,friend - trust,pardon - mercy,loss - removal,destiny - irony,mountain - cabin,ghost - appearance,barrel - basement,marriage - engagement,swell - steamship,discipline - obedience,painter - pianist,analysis - result,veiling - headscarf,nephew - grandmother,redemption - heaven,growth - progress,look - perspective,twilight - dawn,illusion - perception,comedy - drama,clock - church,bungalow - settlement,firmness - strength,criterion - selection,valley - meadow,skin - blood,garden - flowerbed";

  trackByFn(index: any, item: any) {
    return index;
  }

 //constructor() { }
  //yoannes Inject the class in the components where you want to access the global variable:
  constructor(private myForm: FormBuilder,
    private router: Router, private globalService: AppModule) {
  }
  accessGlobalVariable() {
    console.log(AppModule.globalVariable);
    console.log(AppModule.trainigTesting);
  }
// yoannes end


  ngOnInit() {
    this.inputForm = this.myForm.group({
      userInputs: ''
    });
    myUserInputList += "  ,"; // yoannes. In case Enter key is nor pressed the input value will be empty
  }

  ngOnDestroy() { }

  //Focus cursor in input box for each set of words
  @ViewChild("userInputs")
  focus_element!: ElementRef;
  setFocus() {
    this.focus_element.nativeElement.focus();
  }

  ngAfterViewInit() {
    this.focus_element.nativeElement.focus();
  }

  //Funtion with condition for different scenarios
  onEnter(fromDataList: string = '', myWord: string, myuserInput: string) {
    //creating a list w the values given by the user
    myUserInputList = myUserInputList.replace(" ,","") //yoannes. Remuving the empty value predefined in case the Enter key were not pressed.
    myUserInputList += myuserInput + ",";

    if (myuserInput === '') {

      // yoannes, checking time to print message if its
      if (AppModule.trainigTesting == "training"){
        this.errorMessage = "The correct word is " + myWord; 
      }
      global_error++;
      /*console.log("Correct:", global_correct);
      console.log("Error :", global_error);
      console.log("From data: ", fromDataList);*/
    }

    else if (myuserInput != myWord) {

      // yoannes, checking time to print message if its
      if (AppModule.trainigTesting == "training") {
        this.errorMessage = "INCORRECT!, not " + "'" + myuserInput + "'" + ", the correct word is " + myWord;
      }
     global_error++;
       /*console.log("Correct:", global_correct);
       console.log("Error :", global_error);
       console.log("From data: ", fromDataList);*/
    }
    else if (myWord === myuserInput) {
      // yoannes, checking time to print message if its evening
      if (AppModule.trainigTesting == "training") {
        this.correctWord = "Correct answer"
      }
      global_correct++;
      /*console.log("Correct:", global_correct);
      console.log("Error :", global_error);
      console.log("From data: ", fromDataList);*/
    }

    this.popSweetAlert(fromDataList);

  };

  popSweetAlert(fromDataList: string) {

    this.numberCorrectPairs = global_correct                 //yoannes
    this.percentage = (global_correct * 100)/40              //yoannes


if (fromDataList == 'garden') {
  if (global_correct < 24) { // total of 40 words, 60% of 40 is 24 
    var thisComp = this;
           
    // //Creating the .CSV file that stores final results. //yoannes
    // this.createCSVFile(studyID, numberOfWords ,numberCorrectPairs ,percentage , current_date);     
    Swal.fire(
      {
        text: "You answered " + this.percentage + " % of the questions correctly. Please try up to 3 times in total to reach at least 60% of correctly answered questions",
        showCancelButton: true,
        cancelButtonText: "End Test",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continue Test'
      }
    ).then((result) => {
      if (result.value) {
        //win.location = "input-one"
        this.router.navigate(['/app-lits-five']);
        this.createCSVFile(AppModule.globalVariable, this.numberOfWords ,this.numberCorrectPairs ,this.percentage , this.current_date);  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //Asking the user to enter the Study ID to generate the file
        this.createCSVFile(AppModule.globalVariable, this.numberOfWords ,this.numberCorrectPairs ,this.percentage , this.current_date);  
           
        //Go to the home page
        this.router.navigate(['/pass-test']);
      } 
    });
  }
  else if (global_correct >= 24) { 
    Swal.fire(
      {
        text: "You answered " + this.percentage + " % out of 40 words, Test completed"
      }
    ).then(function () {
      win.location = "pass-test";
    });
    this.createCSVFile(AppModule.globalVariable, this.numberOfWords ,this.numberCorrectPairs ,this.percentage , this.current_date);  
  }
}
}
// FRunction that creates the .CSV file //yoannes
createCSVFile(studyID: string, numberOfWords: number ,numberCorrectPairs: number ,percentage: number , current_date: string) {
  /* Define the data */
  const data = [['Study ID', 'Number of Words', 'Number of Correct Pairs', '% of Correct Pairs', 'Date',this.listOfPairs]
  ,[studyID, numberOfWords ,numberCorrectPairs ,percentage +"%" , current_date, myUserInputList]];
  /* Convert the data to a CSV string */
  const csvContent = data.map(row => row.join(',')).join('\n');
  /* Create a Blob object containing the CSV string */
  const blob = new Blob([csvContent], { type: 'text/csv' });
  /* Create a link element */
  const link = document.createElement('a');
  /* Set the link's href to the Blob object */
  link.href = window.URL.createObjectURL(blob);
  /* Set the link's download attribute */
  link.download = AppModule.globalVariable + '-' + current_date +'.csv';
  /* Append the link to the document */
  document.body.appendChild(link);
  /* Click the link to trigger the download */
  link.click();
  /* Remove the link from the document */
  document.body.removeChild(link);
}
}



import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-modal-manage-schedule',
  templateUrl: './modal-manage-schedule.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  styleUrls: ['./modal-manage-schedule.component.scss'],
})
export class ModalManageScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;

  daysOfWeek: string[] = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  availableDaysOfWeek: string[] = [...this.daysOfWeek];

  constructor(
    private dialogRef: MatDialogRef<ModalManageScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barberId: string; barbeariaId: string },
    private fb: FormBuilder,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      workingDays: this.fb.array([]),
      blockedDates: this.fb.array([]),
    });
    this.loadExistingSchedule();
  }

  get workingDays(): FormArray {
    return this.scheduleForm.get('workingDays') as FormArray;
  }

  get blockedDates(): FormArray {
    return this.scheduleForm.get('blockedDates') as FormArray;
  }

  addWorkingDay() {
    if (this.availableDaysOfWeek.length > 0) {
      this.workingDays.push(
        this.fb.group({
          day: ['', []],
          startTime: ['', []],
          endTime: ['', []],
        })
      );
    } else {
      alert('Todos os dias já foram cadastrados!');
    }
    this.updateAvailableDays();
  }

  async removeWorkingDay(index: number) {
    const removedDay = this.workingDays.at(index).value.day;
    this.workingDays.removeAt(index);
    this.updateAvailableDays();

    try {
      const scheduleDocRef = doc(
        this.firestore,
        `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/schedules/schedule`
      );
      const existingSchedule = (await getDoc(scheduleDocRef)).data();

      if (existingSchedule?.['workingDays']) {
        const updatedWorkingDays = existingSchedule['workingDays'].filter(
          (day: any) => day.day !== removedDay
        );
        await updateDoc(scheduleDocRef, { workingDays: updatedWorkingDays });
      }
    } catch (error) {
     return;
    }
  }

  addBlockedDate() {
    this.blockedDates.push(new FormControl(''));
  }

  removeBlockedDate(index: number) {
    this.blockedDates.removeAt(index);
  }

  async saveSchedule() {
    try {
      const scheduleData = this.scheduleForm.value;
      const scheduleDocRef = doc(
        this.firestore,
        `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/schedules/schedule`
      );
      await setDoc(scheduleDocRef, scheduleData, { merge: true });
      alert('Agenda salva com sucesso!');
      this.dialogRef.close();
    } catch (error) {
      return;
    }
  }

  async loadExistingSchedule() {
    try {
      const scheduleDocRef = doc(
        this.firestore,
        `barbearia/${this.data.barbeariaId}/barbers/${this.data.barberId}/schedules/schedule`
      );
      const scheduleDoc = await getDoc(scheduleDocRef);
      if (scheduleDoc.exists()) {
        const data = scheduleDoc.data();
        if (data?.['workingDays']) {
          this.workingDays.clear();
          data['workingDays'].forEach((day: any) => {
            this.workingDays.push(
              this.fb.group({
                day: [day.day || '', []],
                startTime: [day.startTime || '', []],
                endTime: [day.endTime || '', []],
              })
            );
          });
        }
        if (data?.['blockedDates']) {
          this.blockedDates.clear();
          data['blockedDates'].forEach((date: any) => {
            this.blockedDates.push(new FormControl(date || ''));
          });
        }
        this.updateAvailableDays();
      }
    } catch (error) {
      return;
    }
  }

  private updateAvailableDays() {
    const selectedDays = this.workingDays.controls
      .map((control) => control.get('day')?.value)
      .filter((day) => day);

    this.availableDaysOfWeek = this.daysOfWeek.filter((day) => !selectedDays.includes(day));
  }

}

//create startandend schema
const startAndEndSchema= new mongoose.schema(
    {
        startTime:{
            type:Date,
            required:[true,'please enter start time']
        },
        endTime:{
            type:Date,
            required:[true,'please enter end time']
        }
    }
)

//create schedule schema
const scheduleSchema= new mongoose.schema({
    doctorId:{
        type:String,
        required:true
    },
    sat:{
        type:Boolean,
      timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    sun:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    mon:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    tue:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    wen:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    thu:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    },
    fri:{
        type:Boolean,
        timee:{
            type:startAndEndSchema,
            required:true
        }
    }
})



const schedulemodel=mongoose.model('schedule',scheduleSchema);
module.exports=schedulemodel;
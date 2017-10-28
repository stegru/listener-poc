
using System;
using System.Threading.Tasks;
using Windows.Networking.Proximity;
using Windows.Storage.Streams;

public class Startup
{
    private static Func<object, Task<object>> gotTagCallback;

    public async Task<object> Invoke(dynamic input)
    {
        gotTagCallback = input.gotTag;
        ProximityDevice dev = ProximityDevice.GetDefault();
        bool success = false;

        if (dev != null) { 
            dev.SubscribeForMessage("NDEF", new MessageReceivedHandler(GotTag));
            success = true;
        }

        return success;
    }

    private static void GotTag(ProximityDevice device, ProximityMessage message)
    {
        Console.WriteLine("GOT TAG");
        var reader = DataReader.FromBuffer(message.Data);
        byte[] buf = new byte[message.Data.Length];
        reader.ReadBytes(buf);
        gotTagCallback(buf);
    }
}


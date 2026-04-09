use relm4::prelude::*;

pub struct LabelXalign;

#[relm4::component(pub)]
impl SimpleComponent for LabelXalign {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Aligned",
            set_xalign: 0.0,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
